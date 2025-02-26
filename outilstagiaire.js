// Facteurs d'émission pour les modes de transport (kg CO₂ par km)
const emissionFactors = {
    VoitureEssence: 0.107,
    VoitureDiesel: 0.186,
    tram: 0.06,
    bus: 0.12,
    trotinetteElec: 0.027,
    AvionCourt: 0.50,
    AvionLong: 0.130,
    train: 0.014,
    metro:0.0026
};

const transportNames = {
    VoitureEssence: "Voiture Essence",
    VoitureDiesel: "Voiture Diesel",
    tram: "Tram",
    bus: "Bus",
    trotinetteElec: "Trottinette Électrique",
    
    AvionCourt: "Avion Court-Courrier",
    AvionLong: "Avion Long-Courrier",
    train: "Train",
    metro:"Métro"
};

// Variables pour stocker les données du calcul
let finalCarbonResult = null;
let stageCarbonEmission = null;
let homeToWorkCarbonEmission = null;
let userName = "";
let userSurname = "";
let covoit = null;

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
    const distance3 = parseFloat(document.getElementById('distance3').value);

    // Validation des entrées
    if (!userName || !userSurname) {
        alert("Veuillez entrer votre nom et prénom.");
        return;
    }
    if (isNaN(distance) || distance <= 0 || isNaN(distance1) || distance1 <= 0) {
        alert("Veuillez entrer des distances valides.");
        return;
    }

    
    // Calcul des émissions
    const carbonEmissionDeplacement = distance * emissionFactors[transport];
    const carbonJours = carbonEmissionDeplacement * jours;
    const covoitemission = distance3 * emissionFactors.VoitureEssence;
    stageCarbonEmission = distance1 * emissionFactors[mode1];
    finalCarbonResult = carbonJours * duree + stageCarbonEmission;
    homeToWorkCarbonEmission = carbonJours * duree;

    if (distance3 > 0){
        finalCarbonResult = carbonJours * duree + stageCarbonEmission + covoitemission;
        stageCarbonEmission= distance1 * emissionFactors[mode1] + covoitemission

    } 

    // Affichage du résultat
    document.getElementById('result').innerHTML = `
        <p>Votre bilan carbone total correspondant à votre stage d'une durée de ${duree} semaines est de <strong>${finalCarbonResult.toFixed(2)} kg CO₂e</strong>.</p>
        <p>Émissions liées au déplacement domicile-lieu de stage : <strong>${homeToWorkCarbonEmission.toFixed(2)} kg CO₂e</strong>.</p>
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
