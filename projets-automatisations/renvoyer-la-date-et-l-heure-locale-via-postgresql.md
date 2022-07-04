---
layout: default
title: Renvoyer la date et l'heure locale via postgreSQL
tags: SQL postgreSQL automatisation date heure locale serveur
description: Plutôt que de vous baser sur la date et l'heure de l'appareil de votre utilisateur, créez une simple API qui renvoie la date et l'heure locale depuis postgreSQL. 
author: Jady Nekena Ramanandray
published: true
---

* toc
{:toc}

## Demo

• Cliquez <a class="btn btn-white display-4" onclick="alert(display_date_dd_mm_yy_hh_min(new Date))">ICI</a> pour voir date et l'heure actuelle.

• Changez ensuite l'heure de votre appareil, PUIS **recliquez** sur le **bouton précédemment cliqué**. Normalement, le changement d'heure sera bien appliqué.

• Enfin, cliquez <a class="btn btn-white display-4" onclick="(async function(){a = await supabase.rpc('maintenant');new Date(a=a['data']);alert(display_date_dd_mm_yy_hh_min(new Date(a)))})()">ICI</a>pour avoir l'heure réelle.

> Vous avez compris l'idée, le but est de distinguer l'heure de l'appareil de l'heure réelle.


## Utilité
Lorsque vous créez une application qui nécessite une date, je recommande de **toujours** de passer par une date-heure **distante** et non **celle de l'appareil de l'utilisateur**.

En effet, voici 3 bonnes raisons de le faire :
- **Homogénéisation** : selon les appareils de navigation, les formats diffèrent, et donc cela risque de porter à confusion lors de votre collection de données. Mieux vaut partir sur un même format imposé par votre serveur directement.
- **Fiabilité** : si votre application se base sur la date d'aujourd'hui pour limiter/donner accès à certaines fonctionnalités, il est préférable de faire appel à votre serveur pour connaître l'heure locale.
- **Authenticité** : le fait de changer la date et l'heure de l'appareil n'impacte en rien les fonctionnalités de votre application. Petit clien d'oeil à [l'histoire des vies illimitées sur Candy Crush](https://www.nextpit.fr/forum/562381/vies-illimitees-sur-candy-crush-android){:target="_blank"} 🤫

## Le code
Dans **PosgreSQL**, il y a déjà la fonction native **now()** qui renvoie la date et l'heure à UTC+00. Il suffit de préciser qu'on la renvoie avec le **TIMEZONE**, comme l'indique ce code :

```
CREATE OR REPLACE FUNCTION public.maintenant()  RETURNS timestamp WITH TIME ZONE
    LANGUAGE 'plpgsql'
AS
$BODY$
  BEGIN
    RETURN now()::TIMESTAMP  WITH TIME ZONE ;
  END;
$BODY$;
```


Maintenant, dans votre application il suffira d'appeler la fonction ````maintenant()```` pour connaître l'heure réelle, et de faire le traitement nécessaire pour l'afficher avec **fuseau horaire local**. Par exemple en Javascript, on affiche une date contenant la **TIMEZONE** en utilisant ```new Date```.


## ATTENTION
> N'oubliez pas de **remettre la date-heure en automatique sur votre appareil** !