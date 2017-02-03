﻿//========================================================================================// // Export opened AI-drawing in a folder to SVG-graphics.//// Run this script from Adobe Illustrator -> file -> scripts -> browse (select this file)//// Context: PDM G-Star// Author: Giel Scharff// Date: 23-1-2009//// $Log:  62757: Export StyleFabric.jsx //    Rev 1.3    8-11-2007 13:08:44  GS// pad van de inboxes gewijzigd (hoofdletter)//    Rev 1.2    2-11-2007 14:56:56  GS// bugfix voor stylefabrics die eindigen met een . (punt)//    Rev 1.1    27-6-2007 15:46:18  GS// Nieuwe CS3 variant////========================================================================================//// Debug options// $.bp( someValue == 0 ); // Conditional breakpoint// $.level = 0; // Suppress the debugger from being opened;// $.level = 1; // Open the debugger at the beginning of the script;// $.level = 2; // Open the debugger if a run-time error occurs////========================================================================================// Constants//========================================================================================SCRIPT_NAME = "Export StyleFabric";// juiste padSTYLE_FABRIC_EXPORT_PATH      = "/Volumes/PD/PDM/StyleFabric/In";//STYLE_FABRIC_EXPORT_PATH      = "~/Desktop/In";// bewaar laast ingevoerde filenaam in deze variabeleTMP_FOLDER   = "~/";TMP_LASTFILE = ".PDMfilenaam";STYLE_FABRIC_TXT = "svgzFilenaam";POINTS_FACTOR = 28.346 ; // cm --> pointsPOS_X_TEXTFRAME = 26.0 * POINTS_FACTOR ; POS_Y_TEXTFRAME = -1.9 * POINTS_FACTOR ;// alle layernamen moeten uppercase zijnLAYER_FOR_SFBNR = "LAY OUT";LAYER_FOR_SFBNR2 = "LAYOUT";LAYER_FOR_SFBNR3 = "LAY-OUT";   var STYLE_FABRIC_LAYERS = new String("KADER,FRONT,BACK,SMALL BACK,OVERVIEWKADER,ABC,DETAILS,FIGURE");var SET_VISIBLE_LAYERS = new String("FRONT,BACK,OVERVIEWKADER,ABC,DETAILS,FIGURE,LAYOUT,LAY OUT,LAY-OUT");//========================================================================================// Start execution point//========================================================================================Main();//========================================================================================// Main execution path//========================================================================================function Main(){  try  {    var document = app.activeDocument    if ( document != null ) {      CheckLayers(document.layers);            var saveName = ReadDocumentName();      saveName = prompt("Enter the new svgz name :", saveName);            // Save het document eerst zodat de svg altijd hetzelfde is als het bewaarde      // document. Dit doen we na de check zodat we alleen een goedsituatie bewaren!      if ( saveName != null ) {        if ( checkValidSFBnumber(saveName) ) {          RenameLayers(document.layers);          SetVisibleLayers(document.layers);          SaveDocument(saveName);          SaveAsSVG(document, saveName);        }      }    }  }  catch (e)  {    alert(SCRIPT_NAME + " execution stopped, error: " + "\n\n" + e);  }}//========================================================================================//========================================================================================// Check if the required predefined layers are present.//========================================================================================function CheckLayers(docLayers){  var list = STYLE_FABRIC_LAYERS.split(',');  var listCount = list.length;  var ontbreekt = "";  var errorMsg = "";  var meerDanEen = false;  for ( i = 0; i < listCount; i++ )  {    var bestaat = false;    var layerName = new String(list[i]);    bestaat = IsElementOf(layerName, docLayers);    if ( ! bestaat )    {      if ( ontbreekt != "" )      {        ontbreekt = ontbreekt + ', ';        meerDanEen = true;      }      ontbreekt = ontbreekt + layerName    }  }  if ( ontbreekt != "" ) {    if ( meerDanEen )      errorMsg = "De volgende lagen ontbreken: " + ontbreekt    else      errorMsg = "De volgend laag ontbreekt: " + ontbreekt;    throw(errorMsg);  }}//========================================================================================//========================================================================================// Utility: Is candidate element of array?//========================================================================================function IsElementOf(candidate, list){  var result = false;  for ( i = 0; i < list.length; i++)  {    if (candidate == list[i].name) {      result = true;      break;    }  }  return result;}//========================================================================================// Utility: Does candidate exist in array?//========================================================================================function ExistsInList(candidate, list){  result = false;    for ( i = 0; i < list.length; i++)  {    if (candidate == list[i]) {      result = true;      break;    }  }  return result;}//========================================================================================// Save the document as an SVG//========================================================================================function SaveAsSVG(document, newname){  var targetFolder = Folder(STYLE_FABRIC_EXPORT_PATH);  if (! targetFolder.exists) {    // geef een melding en     throw("Onderstaande folder niet gevonden, is de netwerkverbinding gemaakt? \n\n" +           STYLE_FABRIC_EXPORT_PATH);  }  var exportOptions = new ExportOptionsSVG();  var exportType = ExportType.SVG;  var targetFile = MakeTempInvisibleFile(targetFolder, newname, ".ai");  // alert(targetFile);  exportOptions.embedRasterImages = true;  exportOptions.compressed = true;  exportOptions.embedAllFonts = false;  exportOptions.fontSubsetting = SVGFontSubsetting.GLYPHSUSED;  exportOptions.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;  exportOptions.optimezForSVGViewer = true;  document.exportFile( targetFile, exportType, exportOptions );  document.close( SaveOptions.DONOTSAVECHANGES );  var exportedFile = MakeTempInvisibleFile(targetFolder, newname, ".svgz");  // alert(exportedFile);  if (exportedFile.exists) {    if (! exportedFile.rename(newname+ ".svgz")) {      // bij aanwezig zijn oude file, deze proberen te deleten en vervolgens nogmaal renamen:      var fl = new File(targetFolder + "/" + newname + ".svgz");      // alert(fl);      if (fl.remove())         exportedFile.rename(newname+ ".svgz")      else        alert(SCRIPT_NAME + " is niet goed gelukt, oude file is nog aanwezig en niet te overschrijven!")     }  }    else    alert(SCRIPT_NAME + " is niet goed gelukt!")  }function MakeTempInvisibleFile(folder, naam, ext){	return new File(folder + "/._X" + naam + "X" + ext);}//========================================================================================function SaveDocument(savename){  var docRef = app.activeDocument;  var s = "";  aFrameCreated = false;  // Probeer de variabele STYLE_FABRIC_TXT te vinden, en anders STYLE_FABRIC_TXT aanmaken  try {    textVar = docRef.variables.getByName(STYLE_FABRIC_TXT);  }  catch (e) {    textVar = docRef.variables.add();    textVar.kind = VariableKind.TEXTUAL;    textVar.name = STYLE_FABRIC_TXT;   }  // Nu hebben we een textVar. Heeft ie een TextFrame gebonden?  if (textVar.pageItems.length > 0) {    aFrame = textVar.pageItems[0];  }  else {    // we moeten nu het TextFrame aanmaken    aFrame = docRef.textFrames.add();    aFrame.contents = savename;    aFrame.position = Array(POS_X_TEXTFRAME, POS_Y_TEXTFRAME)    aFrameCreated = true;  }  // Nu hebben we een textFrame, wijzig de tekst  aFrame.contents = savename;  // Als het textFrame net gecreerd is, dan moet deze aan de varaiabele gebonden worden  if (aFrameCreated) {    aFrame.contentVariable = textVar;    // Zet font en kleur    // Zou via textFrame.TextRange kunnen (zie blz 252 en blz 241 van CS2 AICS2-JavaScriptGuide.pdf). Dan    // van een juist font van de aanwezige fonts in het document, een applyTo uitvoeren.    //         // In CS werkt dit anders en in praktijk niet! (zie blz 244 van CS AIJavaScriptReference.pdf)    // 10-01-2007 Giel  };    // check of het frame in juiste layer staat:  var layernaam = aFrame.layer.name.toUpperCase();  if ( (layernaam != LAYER_FOR_SFBNR) && (layernaam != LAYER_FOR_SFBNR2) && (layernaam != LAYER_FOR_SFBNR3) )  {    alert("layer voor svgz-Filenaam is onjuist: " + aFrame.layer.name + "\nVerplaats dit frame zelf naar de layer " + LAYER_FOR_SFBNR);  }    //  alert("SAVE textVar :" + textVar.name + " - " + textVar.kind + " - " + textVar.typename);  docRef.save();}function ReadDocumentName(){  var docRef = app.activeDocument;  var s = "";  try {    var textVar = docRef.variables.getByName(STYLE_FABRIC_TXT);    var obj = textVar.pageItems[0];    s = obj.contents;  }    catch(e) {     var saveName = docRef.name;     // default naam is gebaseerd op de filenaam     s = saveName.substring(0,saveName.lastIndexOf(".ai"));  }  return s;}function checkValidSFBnumber( svgznumber ) {  // Opbouw van de expressie:  // begin van de tekst: ^  // precies drie cijfers: \d{3}  // valid tekst (twee tekens, max 8 tekens, geen spatie aan begin of eind): [^<>"?\*\/: ]{1}[^<>"?\*\/:]{0,6}[^<>"?\*\/: ]{1}  // einde van de tekst: $  svgznumberRegex = /^(\d{3}-\d{3}-[^<>"?\*\/: ]{1}[^<>"?\*\/:]{0,6}[^<>"?\*\/: ]{1})$|^(\d{3}-\d{3}-[^<>"?\*\/: ]{1}[^<>"?\*\/:]{0,6}[^<>"?\*\/: ]{1}-[^<>"?\*\/: ]{1}[^<>"?\*\/:]{0,6}[^<>"?\*\/: ]{1})$/;  if( !svgznumber.match( svgznumberRegex ) ) {    alert( "svgz-filenaam is onjuist. Juist voorbeeld: 021-071-12345 of 021-071-12345-123 " );    return false;  }  return true;}//========================================================================================// Rename layer names to zz_name abd back to original name to get internal layer name // the same as user laye namen.//========================================================================================function RenameLayers(docLayers){  var list = new Array();  var prefix = "zz_";    countOfLayers = docLayers.length;  // opbouwen lijstje layers  for ( i = 0; i < countOfLayers ; i++ )  {    list[i] = docLayers[i].name;  }  // rename alle layers naar prefix+layernaam  for ( i = 0; i < countOfLayers ; i++ )  {    theLayer = docLayers.getByName(list[i]);	theLayer.name = prefix + list[i];  }  // rename alle layers weer terug naar oude naam  for ( i = 0; i < countOfLayers ; i++ )  {    theLayer = docLayers.getByName(prefix + list[i]);	theLayer.name = list[i];  }}//========================================================================================// Show layers in SET_VISIBLE_LAYERS and hide other layers//========================================================================================function SetVisibleLayers(docLayers){  var list = SET_VISIBLE_LAYERS.split(',');  countOfLayers = docLayers.length;   var bestaat = false;  for ( j = 0; j < countOfLayers; j++ )  {    bestaat = false;    naam = docLayers[j].name;    bestaat = ExistsInList(naam, list);    docLayers[j].visible = bestaat;  }}