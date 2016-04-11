1. Reprendre le traitement de config. Son initialisation doit se faire au niveau le plus haut mais pour autant on doit pouvoir accéder aux différentes sous parties de manière cloisonnées (Peut-être prévoir une closure lors de l'init du module pour récupérer la partie qui concerne le module).
2. Régler la question de utils/lodash. L'idée serait de pouvoir constituer un objet d'utilitaires qui serait pour partie des fonctions de lodash et d'autre part des fonctions utilitaires propres au projet, le tout porté depuis l'instanciation du service
3. Utiliser babel et passer en es2015
4. Script de déploiement heroku/serveur local
5. Sequelize

