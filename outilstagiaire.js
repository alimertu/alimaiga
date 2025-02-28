// Facteurs d'émission pour les modes de transport (kg CO₂ par km)
const emissionFactors = {
    VoitureEssence: 0.239,
    VoitureDiesel: 0.227,
    tram: 0.00329,
    autobus: 0.113, //autobus gazole
    trotinetteElec: 0.025,
    AvionCourt: 0.258,
    AvionLong: 0.152,
    train: 0.05,
    metro:0.0026,
    AvionMoyen:0.187,
    autocar:0.0295,
    voitureElec:0.103,
    voilier:0,
    marche:0,
    velo:0
};

const transportNames = {
    VoitureEssence: "Voiture Essence",
    VoitureDiesel: "Voiture Diesel",
    tram: "Tram",
    bus: "Bus",
    trotinetteElec: "Trottinette Électrique",
    AvionMoyen : "Avion Moyen-Courrier",
    AvionCourt: "Avion Court-Courrier",
    AvionLong: "Avion Long-Courrier",
    train: "Train",
    metro:"Métro",
    
};

// Variables pour stocker les données du calcul
let finalCarbonResult = null;
let stageCarbonEmission = null;
let homeToWorkCarbonEmission = null;
let userName = "";
let userSurname = "";


// Fonction pour afficher le graphique
function displayCarbonChart(carbonEmission1, carbonJours) {
    const ctx = document.getElementById('carbonChart').getContext('2d');

    // Création du graphique
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Déplacement (Lieu de Stage)', 'Trajets (Domicile-Lieu)'],
            datasets: [{
                label: 'Émissions carbone (kg CO₂e)',
                data: [carbonEmission1.toFixed(2), carbonJours.toFixed(2)],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Émissions (kg CO₂e)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Fonction pour télécharger les résultats au format Excel
function exportToExcel() {
    if (finalCarbonResult === null || stageCarbonEmission === null || homeToWorkCarbonEmission === null) {
        alert("Veuillez effectuer un calcul avant d'exporter les résultats.");
        return;
    }

    // Récupération de la date actuelle (jour-mois-année)
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    // Crée une feuille Excel avec les données
    const worksheetData = [
        ["Nom", "Prénom", "Bilan Carbone Total (kg CO₂e)", "Bilan Carbone Lieu de Stage (kg CO₂e)", "Bilan Carbone Domicile-Lieu (kg CO₂e)", "Date"], // En-têtes
        [userName, userSurname, finalCarbonResult, stageCarbonEmission, homeToWorkCarbonEmission, formattedDate] // Contenu avec la date
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Crée un classeur Excel
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Résultats Bilan Carbone");

    // Utilisation du nom de l'utilisateur pour nommer le fichier Excel
    const fileName = `${userName}_${userSurname}_Bilan_Carbone_${formattedDate}.xlsx`;

    // Télécharge le fichier Excel avec le nom personnalisé
    XLSX.writeFile(workbook, fileName);
}

function toggleCovoituragePassengers(mode) {
    const covoiturage = document.getElementById("covoiturage" + mode).value;
    const passagersContainer = document.getElementById("passagersContainer" + mode);

    if (covoiturage === "oui") {
        passagersContainer.style.display = "block";
    } else {
        passagersContainer.style.display = "none";
        document.getElementById("passagers" + mode).value = ""; // Réinitialiser le champ
    }
}


// Fonction de calcul du bilan carbone
function calculateCarbon() {
    userName = document.getElementById('Nom').value.trim();
    userSurname = document.getElementById('Prénom').value.trim();
    const distance = parseFloat(document.getElementById('distance').value) *2;
    const distance1 = parseFloat(document.getElementById('distance1').value) * 2;
    const transport = document.getElementById('transport').value;
    const mode1 = document.getElementById('Mode1').value;
    const jours = parseFloat(document.getElementById('Jours').value);
    const duree = parseFloat(document.getElementById('Duree').value);
    const distance2 = parseFloat(document.getElementById('distance2').value) * 2;
    const mode2 =  document.getElementById('mode2').value;

    

    // Validation des entrées
    if (!userName || !userSurname) {
        alert("Veuillez entrer votre nom et prénom.");
        return;
    }
    if (isNaN(distance) || distance <= 0 || isNaN(distance1) || distance1 <= 0) {
        alert("Veuillez entrer des distances valides.");
        return;
    }

    

    
    // Vérification du covoiturage et récupération du nombre de passagers
const covoiturage1 = document.getElementById("covoiturage1").value;
const passagers1 = parseInt(document.getElementById("passagers1").value) || 1;

const covoiturage2 = document.getElementById("covoiturage2").value;
const passagers2 = parseInt(document.getElementById("passagers2").value) || 1;

const covoiturage3 = document.getElementById("covoiturage3").value;
const passagers3 = parseInt(document.getElementById("passagers3").value) || 1;

stageCarbonEmission = 0;
carbonEmissionDeplacement=0;

// Calcul pour le premier mode de transport
if (distance1 > 0 && emissionFactors[mode1] !== undefined) {
    let emission = distance1 * emissionFactors[mode1];
    if (covoiturage1 === "oui" && (mode1 === "VoitureDiesel" || mode1 === "VoitureEssence")) {
        emission /= passagers1;
    }
    stageCarbonEmission += emission;
}

// Calcul pour le deuxième mode de transport
if (distance2 > 0 && emissionFactors[mode2] !== undefined) {
    let emission = distance2 * emissionFactors[mode2];
    if (covoiturage2 === "oui" && (mode2 === "VoitureDiesel" || mode2 === "VoitureEssence")) {
        emission /= passagers2;
    }
    stageCarbonEmission += emission;
}
//calcul pour le trajet domicile-lieu de travail
if (distance > 0 && emissionFactors[transport] !== undefined) {
    let emision = distance * emissionFactors[transport];
    if (covoiturage3 === "oui" && (transport === "VoitureDiesel" || transport === "VoitureEssence")) {
        emision /= passagers3;
    }
    carbonEmissionDeplacement += emision;
}


    
    const carbonJours = carbonEmissionDeplacement * jours;
    
    //stageCarbonEmission = distance1 * emissionFactors[mode1];
    finalCarbonResult = carbonJours * duree + stageCarbonEmission;
    homeToWorkCarbonEmission = carbonJours * duree;

  

    // Affichage du résultat
    document.getElementById('result').innerHTML = `
        <p>Votre bilan carbone total correspondant à votre stage d'une durée de ${duree} semaines est de <strong>${finalCarbonResult.toFixed(2)} kg CO₂e</strong>.</p>
        <p>Émissions liées aux déplacements domicile-lieu de stage : <strong>${homeToWorkCarbonEmission.toFixed(2)} kg CO₂e</strong>.</p>
        <p>Émissions liées au déplacement vers le lieu du stage : <strong>${stageCarbonEmission.toFixed(2)} kg CO₂e</strong>.</p>
    `;

    // Affichage de l'histogramme
    displayCarbonChart(stageCarbonEmission, homeToWorkCarbonEmission);

    // Bascule vers la section résultat
    document.getElementById('form-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
}

// Fonction pour revenir au formulaire
function goBack() {
    document.getElementById('form-section').style.display = 'block';
    document.getElementById('result-section').style.display = 'none';
}
