function doGet(e) {
  return doPost(e)
}

function doPost(e) {
  nom = e.parameters.nom
  adresse_mail = e.parameters.adresse_mail

  if(nom && adresse_mail){
    envoyer_mail(nom,adresse_mail)
    msg = 'Mail envoyé à ' +nom+ ' au '+adresse_mail+'.' 
  }else{
    msg = 'ERREUR: Un ou plusieurs paramètres manquants.' 
  }
  
  return message(msg)
}

function envoyer_mail(nom,adresse_mail){
  citation = JSON.parse(citation_aleatoire())
  contenu = LanguageApp.translate(citation['content'],'en','fr')
  auteur = citation['author']

  MailApp.sendEmail({
    to: adresse_mail.toString(),
    subject: 'Citation pour '+ nom,
    htmlBody: contenu_mail(nom,contenu,auteur),
    name: 'Mail Automatique'
  });
}

function contenu_mail(nom,citation,auteur){
  return `
    Bonjour <strong>`+nom+`</strong> !<br/><br/>

    <div>
      <blockquote>`+citation+`<br/>
      - De <strong>`+auteur+`</strong>
      </blockquote>
    </div><br/><br/>

    C'est beau n'est ce pas ?
    Allez, à une prochaine !<br/><br/>

    <i><strong>Mail automatique issu de <a href="https://jadynekena.com/projets-automatisations/configurez-un-mail-automatique-en-moins-de-deux-minutes-avec-votre-compte-gmail">cet article</a></strong></i>.

  `
}

function citation_aleatoire(){
  return UrlFetchApp.fetch('https://api.quotable.io/random').getContentText()
}

function message(msg) {
  return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
  
}