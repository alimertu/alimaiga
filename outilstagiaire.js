// Facteurs d'émission pour les modes de transport (kg CO₂ par km)
const emissionFactors = {
    VoitureEssence: 0.107,
    VoitureDiesel: 0.186,
    tram: 0.06,
    bus: 0.12,
    trotinetteElec: 0.027,
    Voiture_Electrique: 0.0367,
    AvionCourt: 0.50,
    AvionLong: 0.130,
    train: 0.014
};

const transportNames = {
    VoitureEssence: "Voiture Essence",
    VoitureDiesel: "Voiture Diesel",
    tram: "Tram",
    bus: "Bus",
    trotinetteElec: "Trottinette Électrique",
    Voiture_Electrique: "Voiture Électrique",
    AvionCourt: "Avion Court-Courrier",
    AvionLong: "Avion Long-Courrier",
    train: "Train"
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

    // Crée une feuille Excel avec les données
    const worksheetData = [
        ["Nom", "Prénom", "Bilan Carbone Total (kg CO₂e)", "Bilan Carbone Lieu de Stage (kg CO₂e)", "Bilan Carbone Domicile-Lieu (kg CO₂e)"], // En-têtes
        [userName, userSurname, finalCarbonResult, stageCarbonEmission, homeToWorkCarbonEmission] // Contenu
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Crée un classeur Excel
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Résultats Bilan Carbone");

    // Télécharge le fichier Excel
    XLSX.writeFile(workbook, "bilan_carbone.xlsx");
}

// Fonction de calcul du bilan carbone
function calculateCarbon() {
    userName = document.getElementById('Nom').value.trim();
    userSurname = document.getElementById('Prénom').value.trim();
    const distance = parseFloat(document.getElementById('distance').value);
    const distance1 = parseFloat(document.getElementById('distance1').value) * 2;
    const transport = document.getElementById('transport').value;
    const mode1 = document.getElementById('Mode1').value;
    const jours = parseFloat(document.getElementById('Jours').value);
    const duree = parseFloat(document.getElementById('Duree').value);

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
    stageCarbonEmission = distance1 * emissionFactors[mode1];
    finalCarbonResult = carbonJours * duree + stageCarbonEmission;
    homeToWorkCarbonEmission = carbonJours * duree;

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
