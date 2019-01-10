/**
 * JEU 2048
 * !ATTENTION! Il reste à vérifier que l'on peut ajouter une case avant de l'ajouter
 * Aujourd'hui, une case est ajoutée à chaque appuie sur une touche.
 * A terme, une case est ajouté seulement après un glissement ou une fusion.
 */
$(document).ready(function () {
    $(document).click(function () {
        init();
    });

    var tab =
        [['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', '']];

    function makeTableHTML(tab)
    /**
     * Affiche le tableau correspondant à la matrice tab
     * param : tab ; matrice de la grille
     * */ {
        var result = "<table id='table' border=1>"; // création de la balise table dans la variable result
        for (var i = 0; i < tab.length; i++) { // Pour toutes les lignes dans tab
            result += "<tr" + "id=ligne" + "i" + ">"; // ajout des lignes dans result
            for (var j = 0; j < tab[i].length; j++) { // pour toutes les colonnes
                result += "<td>" + tab[i][j] + "</td>"; // ajout des colonnes dans result
            }
            result += "</tr>"; //on ferme les balises tr
        }
        result += "</table>"; //on ferme la balise table
        return result; //return le tableau de jeu
    }


    document.onkeydown = function (e)
        /**
         * param : e ; keyCode d'une touche du clavier
         * */ {
        switch (e.keyCode) { // par exemple dans le cas 37 on appel la fonction gauche,
            // car 37 est le keyCode de la touche 'gauche'.
            case 37:
                left();
                break;
            case 38:
                up();
                break;
            case 39:
                right();
                break;
            case 40:
                down();
                break;
            case 84:
                test();
                break;
        }
    };

    function getCell(colonne, ligne)
    /**
     * Retourne le contenu de la cellule de coordonnées (ligne, colonne).
     * param : ligne ; ligne d'une cellule
     * param : colonne ; colonne d'une cellule
     * */ {
        return document.getElementById('table').rows[colonne].cells[ligne];
    }

    function up()
    /**
     * Fonction lié à la touche 'haut'
     * Algorithme :
     * toutes les cases glissent vers le haut
     * puis on fusionne les cases qui doivent être fusionnées
     * puis on ajoute 2 ou 4 dans une case aléatoirement
     * finalement on re-glisse vers le 'haut'
     * */ {
        console.log("up"); //confirme qu'on a bien appuyé la touche 'haut' dans la console.
        document.getElementById('affichagetouches').innerText = 'HAUT'; //affiche la touche appuyé
        // en haut à gauche de la page
        glideUp();
        fusionUp();
        addOneCell();
        glideUp();

        if (game_over() === true) { //si le jeu est finie (tableau plein)
            init(); //on initialise le jeu
        }
    }

    function down()
    /**
     * Fonction lié à la touche 'bas'
     * Algorithme :
     * toutes les cases glissent vers le bas
     * puis on fusionne les cases qui doivent être fusionnées
     * puis on ajoute 2 ou 4 dans une case aléatoirement
     * finalement on re-glisse vers le 'bas'
     * */ {
        console.log("down");
        document.getElementById('affichagetouches').innerText = 'BAS';
        glideDown();
        fusionDown();
        addOneCell();
        glideDown();

        if (game_over() === true) {
            init();
        }
    }

    function left()
    /**
     * Fonction lié à la touche 'gauche'
     * Algorithme :
     * toutes les cases glissent vers la gauche
     * puis on fusionne les cases qui doivent être fusionnées
     * puis on ajoute 2 ou 4 dans une case aléatoirement
     * finalement on re-glisse vers la 'gauche'
     * */ {
        console.log("left");
        document.getElementById('affichagetouches').innerText = 'GAUCHE';
        glideLeft();
        fusionLeft();
        addOneCell();
        glideLeft();

        if (game_over() === true) {
            init();
        }
    }

    function right()
    /**
     * Fonction lié à la touche 'droite'
     * Algorithme :
     * toutes les cases glissent vers la droite
     * puis on fusionne les cases qui doivent être fusionnées
     * puis on ajoute 2 ou 4 dans une case aléatoirement
     * finalement on re-glisse vers la 'droite'
     * */ {
        console.log("right");
        document.getElementById('affichagetouches').innerText = 'DROITE';
        glideRight();
        fusionRight();
        addOneCell();
        glideRight();

        if (game_over() === true) {
            init();
        }
    }

    function random24()
    /**
     * Return 2 ou 4 avec respectivement les probabilités 0.8 et 0.2
     * */ {
        var x = Math.random(); //x est un nombre aléatoire entre 0 et 1
        if (x < 0.2) { // si x est inférieur à 2
            return 4;
        } else {
            return 2;
        }
    }

    function getRandomInt(min, max)
    /**
     * Return un nombre entier aléatoire entre min et max inclus
     * param : min ; miniumum de l'intervalle
     * param : max ; maximum de l'intervalle
     * */ {
        min = Math.ceil(min); //on arrondi à l'entier inférieur
        max = Math.floor(max); //on arrondi max à l'entier supérieur
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function clearAll()
    /**
     * Efface la grille de jeu
     * */ {
        for (var i = 0; i < 4; i++) { // pour toutes les cases du jeu
            for (var j = 0; j < 4; j++) {
                getCell(i, j).innerHTML = ''; // remplir les cases avec une chaîne de caractères vide.
            }
        }
    }

    function isEmpty(i, j)
    /**
     * Return True si la case (i,j) est vide sinon False
     * param : i ; colonne de la case concernée
     * param : j ; ligne de la case concernée
     */ {
        return getCell(i, j).innerHTML === ""; //return True s'il n'y rien dans la cellule (i,j)
    }

    function setCell(i, j, val)
    /**
     * Met valeur dans la case (i,j)
     * param : i ; colonne de la case conernée
     * param : j ; ligne de la case concernée
     * param : val ; valeur de la case concernée
     * */ {
        getCell(i, j).innerHTML = val; //la case (i,j) vaut val
    }

    function nbEmptyCellsUp(i, j)
    /**
     * Return le nombre de cellule vide au dessus de la case (i,j)
     * param : i ; colonne de la case conernée
     * param : j ; ligne de la case concernée
     */ {

        var nb = 0; //initialisation du nombre de case vide.
        for (var x = 0; x < i; x++) { //pour tout les cases au dessus de (i,j)
            if (isEmpty(x, j)) { //si la case est vide
                nb += 1 // +1 au nombre de case vide
            }
        }
        return nb
    }

    function nbEmptyCellsDown(i, j)
    /**
     * Return le nombre de cellule vide en dessous de la case (i,j)
     * param : i ; colonne de la case conernée
     * param : j ; ligne de la case concernée
     */ {
        var nb = 0;
        for (var x = i; x < 4; x++) {
            if (isEmpty(x, j)) {
                nb += 1
            }
        }
        return nb
    }

    function nbEmptyCellsLeft(i, j)
    /**
     * Return le nombre de cellule vide à gauche de la case (i,j)
     * param : i ; colonne de la case conernée
     * param : j ; ligne de la case concernée
     */ {
        var nb = 0;
        for (var x = 0; x < j; x++) {
            if (isEmpty(i, x)) {
                nb += 1
            }
        }
        return nb
    }


    function nbEmptyCellsRight(i, j)
    /**
     * Return le nombre de cellule vide à droite de la case (i,j)
     * param : i ; colonne de la case conernée
     * param : j ; ligne de la case concernée
     */ {
        var nb = 0
        for (var x = j; x < 4; x++) {
            if (isEmpty(i, x)) {
                nb += 1
            }
        }
        return nb
    }


    function addOneCell()
    /**
     * Ajoute 2 ou 4 aléatoirement dans une case vide
     */ {
        var line = getRandomInt(0, 3); //line et row sont des nombres entier aléatoire entre 0 et 3 inclus.
        var row = getRandomInt(0, 3);

        if (isEmpty(line, row) === true) { //si la case (line,row) est vide
            getCell(line, row).innerHTML = random24(); //on place 2 ou 4 aléatoirement
        } else {
            addOneCell(); // sinon on rappelle la fonction addOneCell
        }
    }

    function init()
    /**
     * INITIALISATION DE LA GRILLE DE JEU
     *
     * */ {
        clearAll(); //on efface tout ce qu'il y a dans la grille
        var line1 = getRandomInt(0, 3); //line1, row1, line2 et row 2 sont des nombres
                                        // entier aléatoire entre 0 et 3 inclus.
        var row1 = getRandomInt(0, 3);
        var line2 = getRandomInt(0, 3);
        var row2 = getRandomInt(0, 3);

        while (line2 === line1 && row2 === row1) { //tant que les cases (line1,row1) et (line2,row2) sont les memes

            line2 = getRandomInt(0, 3); //on cherche une autre case 2
            row2 = getRandomInt(0, 3);
        }
        getCell(line1, row1).innerHTML = random24(); //on place aléatoirement 2 ou 4 dans (line1,row1)
        getCell(line2, row2).innerHTML = random24(); //on place aléatoirement 2 ou 4 dans (line2,row2)
    }

    function glideUp()
    /**
     * Glisse toutes les cases de la grille vers le haut
     */ {
        for (var j = 0; j < 4; j++) { //pour toutes les cases de la grille
            for (var i = 1; i < 4; i++) {
                if (isEmpty(i, j) === false) { //si la case n'est pas vide
                    var x = nbEmptyCellsUp(i, j); //x est le nombre de cellule vide au dessus de (i,j)
                    var val = getCell(i, j).innerHTML; //val est la valeur de la cas (i,j)
                    getCell(i, j).innerHTML = ""; //on vide la case (i,j)
                    setCell(i - x, j, val); //on met val dans la case au dessus de (i,j)
                }
            }
        }
    }

    function glideDown()
    /**
     * Glisse toutes les cases de la grille vers le bas
     */ {
        for (var j = 0; j < 4; j++) {
            for (var i = 2; i >= 0; i--) {
                if (isEmpty(i, j) === false) {
                    var x = nbEmptyCellsDown(i, j);
                    var val = getCell(i, j).innerHTML;
                    getCell(i, j).innerHTML = "";
                    setCell(i + x, j, val);
                }
            }
        }
    }

    function glideLeft()
    /**
     * Glisse toutes les cases de la grille vers la gauche
     */ {
        for (var i = 0; i < 4; i++) {
            for (var j = 1; j < 4; j++) {
                if (isEmpty(i, j) === false) {
                    var x = nbEmptyCellsLeft(i, j);
                    var val = getCell(i, j).innerHTML;
                    getCell(i, j).innerHTML = "";
                    setCell(i, j - x, val);
                }
            }
        }
    }

    function glideRight()
    /**
     * Glisse toutes les cases de la grille vers la droite
     */ {
        for (var i = 0; i < 4; i++) {
            for (var j = 2; j >= 0; j--) {
                if (isEmpty(i, j) === false) {
                    var x = nbEmptyCellsRight(i, j);
                    var val = getCell(i, j).innerHTML;
                    getCell(i, j).innerHTML = "";
                    setCell(i, j + x, val);
                }
            }
        }
    }

    function fusionUp()
    /**
     * Fusionne les cases vers le haut si cela est autorisé par les règles du jeu
     * */ {
        for (var j = 0; j < 4; j++) { // pour toutes les cases du tableau
            for (var i = 0; i < 3; i++) {
                console.log(getCell(i, j)); //affichage du contenu de (i,j) dans la console
                //si (i,j) est de même valeur que la case en dessous de (i,j) et qu'elles ne sont pas vides.
                if (getCell(i, j).innerHTML === getCell(i + 1, j).innerHTML && !isEmpty(i, j)) {
                    var val = getCell(i, j).innerHTML; //val vaut le contenu de (i,j)
                    getCell(i + 1, j).innerHTML = ""; //on vide la case en dessous de (i,j)
                    setCell(i, j, 2 * val); // on remplie (i,j) avec le double de val
                }
            }
        }
    }

    function fusionDown()
    /**
     * Fusionne les cases vers le bas si cela est autorisé par les règles du jeu
     * */ {
        for (var j = 0; j < 4; j++) {
            for (var i = 3; i > 0; i--) {
                console.log(getCell(i, j));
                if (getCell(i, j).innerHTML === getCell(i - 1, j).innerHTML && !isEmpty(i, j)) {
                    var val = getCell(i, j).innerHTML;
                    getCell(i - 1, j).innerHTML = "";
                    setCell(i, j, 2 * val);

                }
            }
        }
    }

    function fusionLeft()
    /**
     * Fusionne les cases vers la gauche si cela est autorisé par les règles du jeu
     * */ {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                console.log(getCell(i, j));
                if (getCell(i, j).innerHTML === getCell(i, j + 1).innerHTML && !isEmpty(i, j)) {
                    var val = getCell(i, j).innerHTML;
                    getCell(i, j + 1).innerHTML = "";
                    setCell(i, j, 2 * val);

                }
            }
        }
    }

    function fusionRight()
    /**
     * Fusionne les cases vers la droite si cela est autorisé par les règles du jeu
     * */ {
        for (var i = 0; i < 4; i++) {
            for (var j = 3; j > 0; j--) {
                console.log(getCell(i, j));
                if (getCell(i, j).innerHTML === getCell(i, j - 1).innerHTML && !isEmpty(i, j)) {
                    var val = getCell(i, j).innerHTML;
                    getCell(i, j - 1).innerHTML = "";
                    setCell(i, j, 2 * val);

                }
            }
        }
    }


    function testIsEmpty1()
    /**
     * test de la fonction IsEmpty
     * */ {
        setCell(0, 0, 2); //init du plateau
        setCell(0, 2, 4);
        var v1 = isEmpty(0, 0); //vérification si ces cases sont vides.
        var v2 = isEmpty(0, 1);
        console.log(v1);
        console.log(v2);
    }

    function testNbEmptyCells1()
    /**
     * test de la fonction NbEmptyCells
     * */ {
        var v3 = nbEmptyCellsLeft(1, 1); //on regarde le nombre de cases vide à gauche de (1,1)
        var v4 = nbEmptyCellsRight(1, 2); //nombre de cases vide à droite de (1,2)
        var v5 = nbEmptyCellsDown(1, 2); //nombre de cases vide en desssous de (1,2)
        console.log(v3); //affichage console
        console.log(v4);
        console.log(v5);
    }

    function testIsEmpty2()
    /**
     * Test de la fonction IsEmpty 2
     * */ {
        setCell(2, 2, 48);
        var result = isEmpty(2, 2);
        console.log(result); // false
        result = isEmpty(1, 2);
        console.log(result); //true
    }

    function testNbEmptyCells2()
    /**
     * Test de la fonction NbEmptyCells 2
     * */ {
        var result;
        setCell(2, 3, 48);
        setCell(2, 1, 8);
        result = nbEmptyCellsUp(2, 3)
        console.log(result); //2
        result = nbEmptyCellsDown(2, 3);
        console.log(result); // 1
        result = nbEmptyCellsLeft(2, 3);
        console.log(result); // 2
    }

    function testGlide()
    /**
     * Test si le glissement vers le bas fonctionne
     * */ {
        setCell(1, 3, 8);
        setCell(2, 3, 8);
        setCell(3, 3, 16);
        setCell(3, 2, 8);
        setCell(3, 1, 2);
        glideDown();
    }

    function testFusion()
    /**
     * Test si la fusion vers la droite fonctionne
     * */ {
        setCell(0, 0, 2);
        setCell(1, 0, 4);
        setCell(2, 0, 8);
        setCell(3, 0, 16);
        setCell(0, 1, 2);
        setCell(1, 1, 4);
        setCell(2, 1, 8);
        setCell(3, 1, 16);
        setCell(0, 2, 32);
        setCell(1, 2, 64);
        setCell(2, 2, 128);
        setCell(3, 2, 256);
        setCell(0, 3, 32);
        setCell(1, 3, 64);
        setCell(2, 3, 128);
        setCell(3, 3, 256);
        fusionRight();
        //glideDown();

    }

    function test()
    /**
     * Appelle la fonction que l'on veut tester
     * */ {
        clearAll(); //vide la grille avant tout
        testGlide();
    }

    //ATTENTION CETTE FONCTION N'indique pas si le jeu est terminé
    // car il est possible que la grille soit pleine et que l'on puisse encore fusionner
    function game_over()
    /**
     * Vérifie si la grille est pleine , si oui return True
     * */ {
        var nbFullCells = 0; //init du nombre de cellule pleine
        for (var i = 0; i < 4; i++) { //pour toutes les cases dans la grille
            for (var j = 0; j < 4; j++) {
                if (!(isEmpty(i, j))) { //si la case (i,j) n'est pas vide
                    nbFullCells += 1; // on incrémente le nombre de case pleine par 1
                }
            }
        }
        if (nbFullCells === 16) { //si le nombre de case pleine est égale à 16
            console.log("GAME OVER") //affichage console
            return true
        } else {
            return false
        }
    }

    $("#tableau").html(makeTableHTML(tab)); //appelle la fonction qui dessine la grille
    console.log("ready!");
    init(); //initialise la grille
});