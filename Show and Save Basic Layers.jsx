//========================================================================================
// 
// Set a fixed list of layers visible and hide the other layers
//
// Run this script from Adobe Illustrator -> file -> scripts -> browse (select this file)
//
// Context: PDM G-Star
// Author: Giel Scharff
// Date: 27-1-2009  
//
//========================================================================================
//
// Debug options
// $.bp( someValue == 0 ); // Conditional breakpoint
// $.level = 0; // Suppress the debugger from being opened;
// $.level = 1; // Open the debugger at the beginning of the script;
// $.level = 2; // Open the debugger if a run-time error occurs
//
//========================================================================================
// Constants
//========================================================================================

SCRIPT_NAME = "Show and Save Basic Layers";

var SET_VISIBLE_LAYERS = new String("FRONT,BACK,OVERVIEWKADER,ABC,DETAILS,FIGURE,LAYOUT,LAY OUT,LAY-OUT");

//========================================================================================
// Start execution point
//========================================================================================
Main();

//========================================================================================
// Main execution path
//========================================================================================
function Main()
{
  try
  {
    var document = app.activeDocument

    if ( document != null )
      SetVisibleLayers(document.layers);
      document.save();  
      //document.close();
  }
  catch (e)
  {
    alert(SCRIPT_NAME + " execution stopped, error: " + "\n\n" + e);
  }
}

//========================================================================================
// Show layers in SET_VISIBLE_LAYERS and hide other layers
//========================================================================================
function SetVisibleLayers(docLayers)
{
  var list = SET_VISIBLE_LAYERS.split(',');

  countOfLayers = docLayers.length;
 
  var bestaat = false;
  for ( j = 0; j < countOfLayers; j++ )
  {
    bestaat = false;
    naam = docLayers[j].name;
    bestaat = ExistsInList(naam, list);
    docLayers[j].visible = bestaat;
  }
}

//========================================================================================
// Utility: Does candidate exist in array?
//========================================================================================
function ExistsInList(candidate, list)
{
  result = false;  
  for ( i = 0; i < list.length; i++)
  {
    if (candidate == list[i]) {
      result = true;
      break;
    }
  }
  return result;
}

