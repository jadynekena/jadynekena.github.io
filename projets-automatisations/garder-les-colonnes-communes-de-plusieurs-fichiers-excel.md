---
layout: default
title: Garder les colonnes communes de plusieurs fichiers Excel
tags: VBA Excel automatisation
description: Analyse 2 plage de données avec des colonnes différentes, c'est compliqué à agréger manuellement, voilà pourquoi je vous propose ce code VBA qui récupère les colonnes communes. 
author: Jady Nekena Ramanandray
published: true
---

* toc
{:toc}

## Demo (video)

Retrouvez ci-dessous l'automatisation en question, que je vais expliquer un peu plus bas.
<div class="videowrapper">	
	<iframe src="https://www.youtube.com/embed/DKNH3amzqZ0?autoplay=1&fs=1&loop=0&rel=0&showinfo=0&modestbranding=1&listType=playlist&playlist=DKNH3amzqZ0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Une application directe de ça ?
Oui.  
Les données (**ouvertes**) de la plateforme **ParcourSup** ont beaucoup changé au fil des années :
- Des colonnes ont disparu ;
- D'autres colonnes sont apparus ; 
- Des colonnes sont restées tout le long.

Evidemment c'est le 3ème point qui nous intéresse, parce qu'on veut de **la donnée cohérente** avant notre analyse. L'objectif est d'unir les fichiers exportés en 1 seul (**très grand**) fichier final, qui servira pour l'analyse globale.

> J'ai d'ailleurs publié [une dataviz à ce sujet](/projets-donnees-ouvertes/?id=aide-au-choix-de-formation-parcoursup){:target="_blank"} pour aider les gens à choisir leur formation.

## Et si on voyait plus loin...
L'historique de données m'a poussée à faire cette automatisation, mais rien n'empêche de le faire pour des **systèmes d'informations qui ont changé**, des **sources de données différentes** avec des informations communes, etc.

## Code source
Vous pouvez télécharger les **4 fichiers sources** (2018 à 2021) et **le fichier d'automatisation** directement [ici](https://drive.google.com/uc?export=download&id=179VfJ-nRAw4gN_2Gu6kzh6xSA1t1FO6s){:target="_blank"} 😊.

D'ailleurs, les **4 fichiers** sources de **ParcourSup** sont également disponibles sur le [site officiel de l'Enseignement supérieur](https://data.enseignementsup-recherche.gouv.fr/pages/explorer/?q=parcoursup&sort=modified&refine.publisher=Minist%C3%A8re%20de%20l%27Enseignement%20sup%C3%A9rieur,%20de%20la%20Recherche%20et%20de%20l%27Innovation%20%3E%20Sous-direction%20des%20Syst%C3%A8mes%20d%27information%20et%20%C3%A9tudes%20statistiques){:target="_blank"}.

