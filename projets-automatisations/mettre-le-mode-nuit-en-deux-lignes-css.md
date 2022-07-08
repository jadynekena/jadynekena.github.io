---
layout: default
title: Comment mettre le mode nuit en deux lignes CSS ?
tags: CSS html mode nuit
description: Vous aimeriez que votre site soit adaptée aux préférences de vos utilisateurs ? Utilisez cette astuce qui le transforme en mode nuit en 2 lignes CSS. Aucune librairie externe requise.
author: Jady Nekena Ramanandray
published: true
---
 

Vous aimeriez que votre site soit adaptée aux préférences de vos utilisateurs ? Utilisez cette astuce qui le transforme en mode nuit en 2 lignes CSS. Aucune librairie externe requise.

* toc
{:toc}


## 3 avantages du mode nuit
Au-delà du style, on a réellement intérêt à mettre en place le mode nuit pour au moins ces 3 raisons : 
- **Peu de consommation d'énergie** donc une **meilleure autonomie** de votre batterie
- **Moins de lumière bleue** émise donc un **meilleur sommeil** lorsque vous allez vous coucher avec votre portable
- **Confort** pour les yeux surtout dans un milieu **peu éclairé** (petit clien d'oeil à tous mes confrères dev !)

## Navigateurs compatibles
Tous **sauf** <u>Opéra Mini</u> et <u>Internet Explorer</u>. Finalement, qui les utilise en 2022 ? 

## Mode nuit en 2 lignes CSS
### Dans votre HTML
```
{%include_relative codes/nuit.html %}
```
### Dans votre CSS (**2 lignes**)
```
{%include_relative codes/nuit.css %}
```
### Demo
Retrouvez le <strong>rendu final de la demo [ici](/projets-automatisations/codes/nuit){:target='_blank'}</strong>.

### Explications
- La première ligne permet de **changer** tout ce qui est **fond blanc à écriture noire** en **fond noir à écriture blanche**, tout en **gardant toutes les autres couleurs**.  
- La deuxième ligne permet d'**ignorer ce changement sur des éléments précis**, en réappliquant le même filtre : une filtre appliqué deux fois s'annule. 

### Remarque importante
Appliquez le ```filter``` sur l'élement **```html```** et non l'élement **```body```** : autrement, des éléments positionnés fixes changent de repères et vous ne pourrez plus avoir des éléments fixes dans votre page. Plus d'informations sur le sujet, en anglais, disponibles [ici](https://stackoverflow.com/questions/52937708/why-does-applying-a-css-filter-on-the-parent-break-the-child-positioning){:target='_blank'}.

## Limites du mode nuit
Je vous invite à visualiser la [vidéo de **Micode**](https://www.youtube.com/embed/ADF2vMkvN8c){:target='_blank'} sur le sujet, un point de vue très intéressant sur les limites du darkmode.
