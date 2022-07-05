---
layout: default
title: Configurez un mail automatique en moins de 5 minutes avec votre compte gmail
tags: google appscript sheets mail automatisation
description: Vous savez que vous pouvez générer des mails automatiques ave votre compte gmail ? Je vous montre comment en moins de 5 minutes.
author: Jady Nekena Ramanandray
published: true
---
 
* toc
{:toc}

### Demo
{% include_relative codes/mail.html %}

J'ai créé une adresse mail publique pour cette démo : [jenvoieunmail2022@gmail.com](mailto:jenvoieunmail2022@gmail.com)

> Oui je ne me suis pas compliqué la vie...

Au clic du bouton d'envoi de mail, une **citation aléatoire** vous est envoyée dans votre boîte mail.

## Créez vous aussi votre mail automatique
On va créer une **mini** webApp où lorsqu'on reçoit le **nom** et l'**adresse mail** de la personne, on lui écrit un mail personnalisé immédiatement. Je vais vous montrer l'exemple de notre démo.

### Sur Google Script
Allez sur [Google Apps Script](https://script.google.com){:target="_blank"} et créez un **nouveau projet** nommé **mail_auto** :
![Comment créer un nouveau projet Google Apps Script](/assets/images/tuto-google-app-script.PNG)

Un nouvel onglet va ensuite s'ouvrir. Copiez dans le fichier à gauche **Code.gs** le code suivant:

```
{% include_relative codes/mail.gs %}
```

Mettez ensuite votre curseur dans la fonction ```doGet``` et cliquez sur **Exécuter**. Des autorisations vont être demandées.   

Sur le premier pop up, cliquez sur **Paramètres avancés** en bas à gauche, puis sur **Accéder à mail_auto** tout en bas :
![Autoriser l'application dans votre compte Google](/assets/images/autoriser_script_google.PNG)

**Autorisez** aussi tous les accès demandés:
![Autoriser l'application dans votre compte Google](/assets/images/autoriser_script_google2.PNG)

Une fois toutes les autorisations données, cliquez sur **Déployer** -> **Nouveau déploiement** :
![Déployer un nouveau déploiement](/assets/images/deployer-gs.PNG)

Mettez les paramètres de déploiement suivants :
- **Type** : Application Web
- **Exécuter en tant que** : Moi
- **Qui a accès** : Tout le monde   
![Explication paramètres de déploiement Google Script](/assets/images/deploiement-gs.PNG)

Copiez l'**URL** de l'**Application Web** <u>tout en bas</u> pour la suite, puis cliquez sur **OK** :
![copier l'URL webApp google script](/assets/images/id-deploiement.PNG)

Et c'est tout bon côté **Google Script** !

### Page html de votre webApp
Copiez le code suivant dans un <u>fichier local</u> _**mail.html**_ pour personnaliser le mail, **en copiant la valeur de SCRIPT_URL par le vôtre**:
```
{% include_relative codes/mail.html %}
```

Ouvrez-le dans un navigateur, et **TADAAAAAAA** !

## Exemples d'utilité
Réadaptez le code pour en faire **ce que vous voulez**. Je vais vous citer **3 exemples** d'applications simples.
### Envoyer un mail personnalisé après une action
Comme dans notre mini webApp, l'action de cliquer sur un bouton a engendré l'envoi du mail. Cette action peut être aussi du **côté serveur**, par exemple lorsque :
- Une erreur est détectée pendant l'exécution d'un script ;
- Il y a une nouvelle insertion de ligne dans une base de données ;
- Une donnée a été modifiée dans une table ;
- etc.

### Itérer sur une liste dans Google Sheets
Quand vous collectez des noms et adresses mails [**<u>de façon légale et consentie</u>**](https://agence-rhapsodie.fr/rgpd-comment-recolter-emails/){:target="_blank"} (pour un événement par exemple), vous pouvez alors envoyer des informations complémentaires 1 à 1 à vos invités.  
C'est un peu comme une forme de **newsletters**, mais **sans passer par des outils tierces** (à part votre compte Google), et avec **1 seul destinataire par mail** rédigé.

### Configurer un mail hebdomadaire avec un contenu dynamique
Dans notre demo, le contenu de notre mail est dynamique : il change en fonction du **nom** et de la **citation** qu'on envoie. Et si on envoyait une citation par jour à 6h du matin ?

#### - Code à rajouter à la fin de votre projet Google Script
```
function envoyer_nouvelle_citation() {
	envoyer_mail('VotreNomIci','votreadressemail@example.com')
}
```

#### - Choix de la fréquence d'envoi
A gauche de votre projet, allez dans **Déclencheur** -> **Ajouter un déclencheur**. Appliquez ensuite les paramètres ci-dessous, et **enregistrez**.

![Où se trouve le déclencheur de Google Script](/assets/images/declencheur.PNG)

![Paramètres déclencheur envoi mail à fréquence donnée](/assets/images/parametres-declencheur.PNG)

Et voilà ! vous recevrez votre citation tous les matins entre 5h et 6h du matin. Il vous suffira de supprimer votre déclencheur pour désactiver ces mails.

## Limites
A ce jour (**Juillet 2022**), un compte google <u>gratuit</u> peut envoyer :
- **100 mails par jour**
- Un mail de taille **200ko maximum**
- **50 pièces jointes** par mail envoyé
- des **pièces jointes** de taille totale **25Mo maximum**

Pour un simple utilisateur, c'est largement suffisant pour faire ce qu'on veut !

> Vous pouvez consulter le quotas officiel sur le [site officiel de Google Script](https://developers.google.com/apps-script/guides/services/quotas){:target="blank"}.

