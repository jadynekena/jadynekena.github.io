---
layout: default
title: Optimisez vos exécutions VBA avec ces 4 astuces (testées et approuvées)
tags: VBA Excel optimisation
description: Coder c'est bien, optimiser son code c'est mieux. Voici 4 astuces sur VBA !
author: Jady Nekena Ramanandray
published: true
---

Automatiser pour gagner du temps, c'est bien. **Optimiser son code VBA** pour baisser au minimum sa durée d'exécution, c'est mieux !  

Je vais vous prouver qu'en appliquant [mes astuces](#mes-astuces), on peut **diviser le temps d'exécution jusqu'à 41x** 🤯 (même moi j'étais ébahie par ce chiffre).

## Mes astuces
### 1. Evitez la méthode **.Activate**
Même si l'**enregistreur** aide à créer une macro VBA sans forcément savoir coder...
![le-fameux-enregistreur-macro](/assets/images/macro.PNG)

... Et bien ce n'est **pas tout à fait optimal** de s'arrêter là !  

En fait, l'enregistreur va transcrire **chacune de vos actions manuelles**, notamment le fait de sélectionner une feuille par la méthode **Activate**. Or, cette méthode est inutile dans le code, car c'est une **manipulation purement graphique** pour que vous ayez les données sous vos yeux. La machine (donc le code) lui, n'en a pas besoin.

### 2. Evitez la méthode **.Select**
On sélectionne une plage de données souvent pour en faire une copie (**.Copy** sur l'enregistreur), ou pour y insérer une valeur. Encore une fois, cette sélection est une **manipulation graphique inutile pour le code**. Utilisez uniquement « **.Value =** » pour assigner la valeur d'une plage de données.

### 3. Utilisez les **fonctions natives d'Excel Application.WorksheetFunction** avec **R1C1** au lieu des boucles
En parlant d'assignation de valeurs, il est fréquent que la valeur à mettre dépend d'une autre cellule. Plutôt que de traiter ligne par ligne les valeurs à calculer, considérez la [solution de formules R1C1](https://docs.microsoft.com/fr-fr/office/vba/api/excel.range.formular1c1){:target="_blank"}.

### 4. Utilisez les tableaux internes au lieu des cellules
On va souvent itérer ligne par ligne ou colonne par colonne... Mais encore une fois, boucler sur des éléments **graphiques** tels que les cellules est très consommateur.  
La solution ? **Stocker** les valeurs de la plage à traiter **dans une variable locale**. Nous verrons un peu plus tard comment dans [la méthode optimale à garder en tête](#la-méthode-optimale-à-garder-en-tête).



## Avec et sans ces astuces : la comparaison et les résultats
J'ai mis en place **4 types de tests** :
- ### a) Copie de valeur :
	![resultats-copie-avec-sans-activate-et-select](/assets/images/tests-copie.PNG)
	Sur presque **3000** séries de tests, on s'aperçoit que ne pas utiliser **.Activate** et **.Select** divise déjà le temps d'éxecution par 2, et couplé avec l'assignation « **.Value =** » au lieu de la méthode **.Copy**, on a bien le **facteur 41 entre le plus et le moins optimal**.
- ### b) Insertion de plusieurs valeurs
	![resultats-insertion-plusieurs-cellules](/assets/images/tests-insertion.PNG)
	Sur **52000 cellules insérées**, on s'aperçoit qu'il est mieux de d'abord **rassembler les données dans un tableau local** avant de les mettre dans une plage de données : c'est l'**insertion massive**. On y gagne **1.6x** plus de temps, et sur de grosses données, ça peut vraiment faire la différence.
- ### c) Calculs simples
	![resultats-calculs-vba-ou-fonction-excel](/assets/images/tests-calculs.PNG)
	Les **800 calculs tests** consistaient à sommer un grand nombre de valeurs, soit en faisant les **calculs sur VBA**, soit en passant par des **formules R1C1 Excel**.  
	Comme je l'ai dit dans l'[astuce numéro 3](#3-utilisez-les-fonctions-natives-dexcel-avec-r1c1-au-lieu-des-boucles), on voit bien ici qu'exploiter les fonctionnalités d'Excel directement est **5x** plus rapide.
- ### d) Recherche de valeur
	![resultats-recherche-valeur-lointaine](/assets/images/tests-recherche.PNG)
	L'expérience est de faire chercher une valeur très loin dans la feuille de calcul. J'ai testé 3 méthodes : **fonction native de recherche** d'Excel, copie des plages de valeurs à chercher **avec Set** et **sans Set**.
	> **Set** permet de configurer une variable pour qu'elle se mette à jour avec sa référence. <u>Exemple</u>: ```Set valeur_de_a1 = Range("A1") ``` : si on met à jour la valeur de la cellule A1 dans Excel, alors ```valeur_de_a1.Value```  va renvoyer cette nouvelle valeur.

## LA méthode optimale à garder en tête
Si vous devez retenir 3 choses, ce sont ces points là :
- Ne **PAS** (ou plus) utiliser : .**Activate**, .**Select**, .**Copy**   
- Favoriser les **Application.WorksheetFunction** et l'**affectation par formule R1C1** avec **.Value =**   
- **Stocker** les **plages de données** à traiter dans une **variable locale** pour ne pas itérer directement sur les cellules.

## Exemple concret
On veut copier la **valeur de A1 de la feuille 1** dans les **lignes A1 à A5000 de la feuille 2**, en précisant à la copie <u>le numéro de ligne de la feuille 2</u>.
### Avant
```
Sub avant() 'durée d'exécution : 22 secondes

    Worksheets(1).Activate
    Worksheets(1).Range("A1").Select
    Selection.Copy
    Worksheets(2).Activate
    
    For i = 1 To 5000
        Worksheets(2).Range("A" & i).Select
        ActiveSheet.Paste
        ActiveCell.Value = ActiveCell.Value & " ligne " & i
    Next
    
    
End Sub
```
### Après
```
Sub apres() 'durée d'exécution : moins d'1 seconde
	
    'déclarer les variables locales de noms explicites
    Dim valeur_a_copier As String
    Dim valeur_finale As String
    dim plage_copie as string

    plage_copie = "A1:A5000"
    
    'stocker dans une variable sans Set
    valeur_a_copier = Chr(34) & ThisWorkbook.Worksheets(1).Range("A1").Value & "  ligne " & Chr(34)

    'utiliser la fonction native =LIGNE(cellule) d'Excel
    valeur_finale = "=" & valeur_a_copier & " & " & "ROW(RC1)"
    ThisWorkbook.Worksheets(2).Range(plage_copie).FormulaR1C1 = valeur_finale
    
    'écraser les formules par les valeurs
    ThisWorkbook.Worksheets(2).Range(plage_copie).Value = ThisWorkbook.Worksheets(2).Range("A1:A5000").Value   
    
    
End Sub
```

... Et résultats :
- Pas de **boucles**
- Pas de **manipulations graphiques inutiles**
- Code **commenté** et avec des **variables locales déclarées**
- **Maintenance facile** en changeant juste la valeur de ```plage_copie```
- **22x plus rapide**

> Vous pouvez copier le classeur contenant ces 2 fonctions ```avant```/```apres``` [ici](/assets/examples/avant_apres.xlsm){:target="_blank"}.


## Code source des tests
J'ai automatisé tous ces tests, et je vous les mets à disposition si vous avez envie d'y jeter un coup d'oeil : [c'est par ici et c'est gratuit](https://drive.google.com/uc?export=download&id=1gpglbLfgdEhoyH2QRt0D_mQxi1CkIwMj){:target="_blank"} !


