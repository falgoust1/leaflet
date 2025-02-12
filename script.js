// Initialiser la carte
var map = L.map('map', {
center: [48.11, -1.667],
zoom: 12, attributionControl: true });

// Ajouter des fonds de carte
var basemap = {
fond_patois: L.tileLayer('https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png'),
fond_simple: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'),
fond_noir: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'),
OrthoRM:L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers: 'raster:ortho2014'}),
FondRM:L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers:'ref_fonds:pvci_simple_gris'})};

basemap.fond_patois.addTo(map);

// Ajouter une MiniMap

var miniMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png');
var miniMap = new L.Control.MiniMap(miniMapLayer, { toggleDisplay: true,
minimized: false, position: 'bottomright'
}).addTo(map);

//Ecouter l'événement de changement de fond de carte
map.on('baselayerchange', function(event){miniMapLayer.setUrl(event.layer._url);});

// Ajouter le controleur de couches

// Ajouter une attribution personnalisée directement via la carte
map.attributionControl.addAttribution('© Master <a href="https://esigat.wordpress.com/" target=blank>SIGAT</a> / OSM / Rennes Métropole');

//Ajouter une échelle carto 
L.control.scale().addTo(map);

//Modifier les pictos 
var Rennes2icone = L.icon({
iconUrl: 'https://www.theapolis.de/files/api/public/image/organization/37933/profile_photo/1',
iconSize: [30, 30] });

var Gare = L.icon({
iconUrl: 'https://argentanwebferro.fr/wp-content/uploads/2020/06/Logo-SNCF-1937.png',
iconSize: [30, 30] });

// Ajouter des marqueurs manuels
var popuprennes2 = '<h1>Université Rennes 2 </h1> <br> <img src="https://sites-formations.univ-rennes2.fr/cirefe/wp-content/uploads/2017/07/Plan-Campus.jpg" width="200px">';

var Rennes2 = L.marker([48.119, -1.7013], {icon: Rennes2icone}).bindPopup(popuprennes2,customOptions);

var customOptions = {'maxWidth': '500', 'className' : 'custom'}

var Gare = L.marker([48.103, -1.672], {icon: Gare}).bindPopup('<b>Gare de Rennes</b>',customOptions);

// Ajouter un gestionnaire d'événements pour le survol (hover)
Gare.on('mouseover', function (e) {this.openPopup();});
// Ajouter un gestionnaire d'événements pour quitter le survol (hover)
Gare.on('mouseout', function (e) {this.closePopup();});

//Ajout d'une couche WMS : le cadastre 

var Cadastre = L.tileLayer.wms('http://geobretagne.fr/geoserver/cadastre/wms',
{layers: 'CP.CadastralParcel',format: 'image/png',transparent: false, opacity: 0.5});

var Bati = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers: 'ref_cad:batiment',format: 'image/png',transparent: true});

var Cycl = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers: 'trp_doux:v_voirie_amenagement_velo',format: 'image/png',transparent: true});

var Trafic = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers: 'trp_rout:v_rva_trafic_fcd',format: 'image/png',transparent: true});

var url = 'https://raw.githubusercontent.com/mastersigat/data/main/velostar.geojson';
$.getJSON(url, function (geojson) {
var velos = L.geoJson(geojson,{
// Transformer les marqueurs en point
pointToLayer: function (geoJsonPoint, latlng) {
return L.circleMarker(latlng);
},
// Modifier la symbologie des points
style: function (geoJsonFeature) {
return {
fillColor: '#001f3f',
radius: 6,
fillOpacity: 0.7,
stroke: false};
},
}
).addTo(map);
  // Ajout Popup
velos.bindPopup(function(velos) {console.log(velos.feature.properties);
return "<h2> Station : "+velos.feature.properties.nom+"</h2>"+"<hr><h2>"
+velos.feature.properties.nombreemplacementstheorique+ "&nbsp; vélos</h2>" ;

});
});

//Contrôler les marqueurs

var couche = {"Université Rennes 2":Rennes2, "Gare SNCF de Rennes":Gare, "Cadastre": Cadastre, "Bâtiments":Bati, "Aménagement cyclables":Cycl, "Trafic en temps réel":Trafic};

//Faire 2 menus séparés pour les check box et les round buttons
// Menu fond de carte
var menu1 = L.control.layers(basemap, null, {position:'topright', collasped:false}).addTo(map);
//Menu couches
var menu2 = L.control.layers(null, couche, {position:'topright', collasped:false}).addTo(map);

// Fonction pour ajouter un titre au menu
function addTitle(control, title) {
    var container = control.getContainer(); // Récupère le conteneur du menu
    var titleElement = document.createElement("div"); // Crée un élément div
    titleElement.innerHTML = `<strong>${title}</strong>`; // Ajoute le titre en gras
    titleElement.style.padding = "5px"; // Ajoute un peu de style
    titleElement.style.textAlign = "center";
    titleElement.style.backgroundColor = "#006A4E";
    titleElement.style.color = "white";
    container.prepend(titleElement); // Insère le titre en haut du menu
}

// Ajouter des titres aux menus
addTitle(menu1, "Fonds de carte");
addTitle(menu2, "Couches de données");