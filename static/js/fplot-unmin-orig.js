/*
fplot.js - Raphael-based forest plotter, 2011
Contact nnovak at UCLA dot edu with questions
*/
 
var devMode = false;		//this bool is important! If true, the visualizer will not use AJAX to load external JSON data, but will 
var continueLoading = true;

//Disable visualizer for browser versions in which Raphael is not supported
if(BrowserDetect.browser == "Firefox" && BrowserDetect.version < 3.6)
	disableVis("Firefox", 3.6);
if(BrowserDetect.browser == "Safari" && BrowserDetect.version < 3)
	disableVis("Safari", 3);
if(BrowserDetect.browser == "Chrome" && BrowserDetect.version < 5)
	disableVis("Google Chrome", 5);
if(BrowserDetect.browser == "Opera" && BrowserDetect.version < 9.5)
	disableVis("Opera", 9.5);

	
if(BrowserDetect.browser == "Explorer")
{
	$(document).ready(function()
	{
		document.getElementById("browserRecommend").innerHTML = "<span class='reference'><b><u>Warning</u>:</b> you are using " + BrowserDetect.browser + " but it is highly recommended that you use <a href='http://www.mozilla.com/en-US/firefox/fx/'>Firefox</a> or <a href='http://www.google.com/chrome/intl/en/make/download.html'>Chrome</a>. You may experience performance issues using "+BrowserDetect.browser+". Additionally, some features may not work properly, so please use one of our recommended browsers for a better experience.<br /><br /><hr /><br /></span>";
	})
}

function disableVis(b, v)
{
	continueLoading = false;
	$(document).ready(function() {
	if(v>0)
		document.getElementById("holder").innerHTML = "<b>Your version of "+b+" is out of date. To use the data visualization utility, please update your browser to version "+v+" or above. Note that Firefox or Chrome are recommended for this utility.</b>";
	else
		document.getElementById("holder").innerHTML = "<b> "+b+" is not supported. Please use one of our recommended browsers, <a href='http://www.mozilla.com/en-US/firefox/fx/'>Firefox</a> or <a href='http://www.google.com/chrome/intl/en/make/download.html'>Chrome</a>, to use this visualization utility.</b>";
	});
}

if(continueLoading){

//======= Init =========================

//JSON used to populate the first flexbox
var jPlotWhat = {"results":[  
	{"id":1,"name":"Genes"},   
	{"id":2,"name":"Tasks"} 
]};


//This is a sample JSON object representing a forest plot. If devMode == true, this object will be used to create the plot and no JSON objects will be requested from the server
var jData1 = {"subLabelsText": ["task", "indicator", "refSeq", "pID", "genotype", "mean"], "lowerConfidenceInterval": [-0.60999999999999999, -0.41999999999999998, -0.55000000000000004, -0.41999999999999998, -0.72999999999999998, -0.58999999999999997, -0.78000000000000003, -0.59999999999999998, -0.45000000000000001, -0.65000000000000002, -0.46000000000000002, -0.53000000000000003, -0.39000000000000001, -0.19, -0.20999999999999999, -0.20000000000000001, -0.52000000000000002, -0.47999999999999998, -0.53000000000000003, -0.55000000000000004, -0.88, -0.81999999999999995, -0.64000000000000001, -0.97999999999999998, -0.91000000000000003, -0.71999999999999997, -0.67000000000000004, -0.25, -0.32000000000000001, -0.32000000000000001, -0.63, -0.56000000000000005, -0.55000000000000004, -0.57999999999999996, -0.89000000000000001, -0.82999999999999996, -0.64000000000000001, -0.95999999999999996, -0.91000000000000003, -0.69999999999999996, -0.64000000000000001, -0.20999999999999999, -0.23000000000000001], "means": [-0.089999999999999997, -0.040000000000000001, -0.23000000000000001, -0.059999999999999998, -0.20999999999999999, -0.17000000000000001, -0.37, -0.19, 0.040000000000000001, -0.13, 0.02, -0.17000000000000001, -0.02, 0.14999999999999999, 0.29999999999999999, 0.17999999999999999, -0.20000000000000001, -0.12, -0.0, -0.12, -0.48999999999999999, -0.40999999999999998, -0.12, -0.48999999999999999, -0.40999999999999998, -0.38, -0.29999999999999999, 0.070000000000000007, 0.17000000000000001, 0.050000000000000003, -0.31, -0.20999999999999999, -0.02, -0.14999999999999999, -0.51000000000000001, -0.41999999999999998, -0.13, -0.47999999999999998, -0.40000000000000002, -0.35999999999999999, -0.27000000000000002, 0.11, -0.16], "uppperConfidenceInterval": [0.44, 0.34000000000000002, 0.089999999999999997, 0.28999999999999998, 0.31, 0.25, 0.040000000000000001, 0.20999999999999999, 0.53000000000000003, 0.38, 0.5, 0.19, 0.34999999999999998, 0.47999999999999998, 0.80000000000000004, 0.55000000000000004, 0.12, 0.23000000000000001, 0.52000000000000002, 0.29999999999999999, -0.10000000000000001, 0.0, 0.39000000000000001, -0.01, 0.089999999999999997, -0.040000000000000001, 0.070000000000000007, 0.40000000000000002, 0.67000000000000004, 0.41999999999999998, 0.02, 0.14999999999999999, 0.5, 0.27000000000000002, -0.13, -0.0, 0.39000000000000001, -0.0, 0.12, -0.02, 0.11, 0.41999999999999998, -0.10000000000000001], "labels": [19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, 19211801, "meta_all"], "pooledSampleSize": [85, 114, 158, 124, 62, 91, 135, 101, 75, 119, 85, 148, 114, 158, 85, 114, 158, 124, 62, 91, 135, 101, 75, 119, 85, 148, 114, 158, 85, 114, 158, 124, 62, 91, 135, 101, 75, 119, 85, 148, 114, 158], "pooledVariance": [0.071218336261419782, 0.037301587508257121, 0.027019446381576693, 0.032786885245901627, 0.070713067568132157, 0.045633072103176776, 0.04322579250490273, 0.04261389745260713, 0.062550001609561076, 0.068278967372507104, 0.059973452545985462, 0.034147016263208353, 0.036110492289504297, 0.029257688534064092, 0.066682342757021992, 0.035991226515420069, 0.026886028398125161, 0.032786885245901627, 0.071423262727610529, 0.04715748951673885, 0.03968443423507971, 0.04401902694098566, 0.06941458214662119, 0.061667637855139214, 0.065177315861239052, 0.030053565156304887, 0.035834296954150587, 0.027175080018585429, 0.063872198271944347, 0.035830334266921844, 0.027182436047166244, 0.032786885245901627, 0.072332055091654024, 0.046547401065637324, 0.038189940173852431, 0.044668146686270137, 0.068276269026572509, 0.0600764246013194, 0.068641196836844331, 0.030053565156304887, 0.036327871544494024, 0.026280479445465306], "subLabelsDB": ["task", "indicator", "refSeq", "pID", "genotype", "mean"], "subLabelsC": ["rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "rs8191992,rs1044396", "meta_all"], "subLabelsB": ["Vocabulary", "Vocabulary", "Vocabulary", "Vocabulary", "Vocabulary", "Vocabulary", "Vocabulary", "Vocabulary", "Vocabulary", "Vocabulary", "Vocabulary", "Vocabulary", "Vocabulary", "Vocabulary", "Logical memory delayed recall subtest", "Logical memory delayed recall subtest", "Logical memory delayed recall subtest", "Logical memory delayed recall subtest", "Logical memory delayed recall subtest", "Logical memory delayed recall subtest", "Logical memory delayed recall subtest", "Logical memory delayed recall subtest", "Logical memory delayed recall subtest", "Logical memory delayed recall subtest", "Logical memory delayed recall subtest", "Logical memory delayed recall subtest", "Logical memory delayed recall subtest", "Logical memory delayed recall subtest", "Logical memory immediate recall subtest", "Logical memory immediate recall subtest", "Logical memory immediate recall subtest", "Logical memory immediate recall subtest", "Logical memory immediate recall subtest", "Logical memory immediate recall subtest", "Logical memory immediate recall subtest", "Logical memory immediate recall subtest", "Logical memory immediate recall subtest", "Logical memory immediate recall subtest", "Logical memory immediate recall subtest", "Logical memory immediate recall subtest", "Logical memory immediate recall subtest", "Logical memory immediate recall subtest", "meta_all"], "subLabelsA": ["WAIS-V", "WAIS-V", "WAIS-V", "WAIS-V", "WAIS-V", "WAIS-V", "WAIS-V", "WAIS-V", "WAIS-V", "WAIS-V", "WAIS-V", "WAIS-V", "WAIS-V", "WAIS-V", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "WMS-R", "meta_all"], "genotypes": ["A/A,C/C vs. A/A,T/T", "A/A,C/C vs. A/T,C/C", "A/A,C/C vs. A/T,C/T", "A/A,C/C vs. A/T,T/T", "A/A,C/C vs. A/A,T/T", "A/A,C/C vs. A/T,C/C", "A/A,C/C vs. A/T,C/T", "A/A,C/C vs. A/T,T/T", "A/A,T/T vs. A/T,C/C", "A/A,T/T vs. A/T,C/T", "A/A,T/T vs. A/T,T/T", "A/T,C/C vs. A/T,C/T", "A/T,C/C vs. A/T,T/T", "A/T,C/T vs. A/T,T/T", "A/A,C/C vs. A/A,T/T", "A/A,C/C vs. A/T,C/C", "A/A,C/C vs. A/T,C/T", "A/A,C/C vs. A/T,T/T", "A/A,C/C vs. A/A,T/T", "A/A,C/C vs. A/T,C/C", "A/A,C/C vs. A/T,C/T", "A/A,C/C vs. A/T,T/T", "A/A,T/T vs. A/T,C/C", "A/A,T/T vs. A/T,C/T", "A/A,T/T vs. A/T,T/T", "A/T,C/C vs. A/T,C/T", "A/T,C/C vs. A/T,T/T", "A/T,C/T vs. A/T,T/T", "A/A,C/C vs. A/A,T/T", "A/A,C/C vs. A/T,C/C", "A/A,C/C vs. A/T,C/T", "A/A,C/C vs. A/T,T/T", "A/A,C/C vs. A/A,T/T", "A/A,C/C vs. A/T,C/C", "A/A,C/C vs. A/T,C/T", "A/A,C/C vs. A/T,T/T", "A/A,T/T vs. A/T,C/C", "A/A,T/T vs. A/T,C/T", "A/A,T/T vs. A/T,T/T", "A/T,C/C vs. A/T,C/T", "A/T,C/C vs. A/T,T/T", "A/T,C/T vs. A/T,T/T", "meta_all"]}

var firstBackRect;
var backRect;
var tipText = "";
var over = false;
var metaAnalysisAddressList = new Array();	//Array which stores the user's selection of criteria on which a meta analysis will be requested

//======= Functions =======================

//Move the tooltip using CSS, if the mouse is moving and hovering an element that has a tooltip
$(document).mousemove(function(e)
{
	if (over)
	{
		$("#tip").css("left", e.pageX+20).css("top", e.pageY+20);
		$("#tip").html(tipText);
	}
});

//Add a tooltip to an element, which will be displayed on mouseover. The tooltip style is controlled in the CSS style
function addTip(node, txt)
{	
	$(node).mouseenter(function()
	{
		tipText = txt;
		$("#tip").show();
		over = true;
	}).mouseleave(function()
	{
		$("#tip").hide();
		over = false;
	});
}


//Main function which draws the forest plot
Raphael.fn.fplot = function (canvasWidth, query, means, lowerCI, upperCI, labels, subLabText, subLabDB, subLabA, subLabB, subLabC, genotypes, sampleSizes)
{	
	//Preprocess arrays

	subLabB = processArray(subLabA, subLabB);
	subLabC = processArray(subLabB, subLabC);

	//You can tweak these variables to alter the spacing and various dimensions of the plot

	var xStart = 150;							//Default 150
	var subLabelsEnd = xStart - 30;				//Default xStart - 30
	var currY = 150;							//Vertical starting position for the dynamically placed elements. Default 150
	var canvasCutOff = 325;					//Number of pixels to be shaved off from the right side of the canvas and used for text. Default 325
	var yMod = 50;							//Number of pixels used to space objects vertically. Default 50
	var labelsTextOffsetX = 110;					//Number of pixels used as spacer between end of graph and start of Y axis text. Default 50
	var axisTextOffsetY = 10;					//Number of pixels used as spacer between the x axis and the text below it. Default 10
	var barHeight = 5;							//Vertical fatness of each bar, in pixels. Default 5
	var barRoundedEdges = 5;					//Roundness of each bar. Default 5
	var textRotation = -45;						//Number of degrees to rotate label text at the top of plot. Default -40
	var topTextLabelSpacing = 10;				//Number of pixels between the labels at the top of the screen and the beginning of the plot area. Default 10
	var radius = 5	;							//Radius to use for the mean circles on the forest plot, if not using radius proportional to sample size
	var radiusMin = 5;							//Minimum radius to use for mean circles. Default 5
	var radiusMax = 15;						//Maximum radius to use for mean circles. Default 25
	var diamondSize = 5;						//Diameter of the diamond. Default 5
	var fontFamily = "Helvetica, Arial, sans-serif";	//Font family used for all text within the plot
	var articleLinkLocation = "http://www.ncbi.nlm.nih.gov/pubmed?term=";
	var minValue = getMin(lowerCI);	
	var maxValue = getMax(upperCI);
	var range = maxValue - minValue;
	var minSS = getMinInDataRange(sampleSizes, labels);
	var maxSS = getMaxInDataRange(sampleSizes, labels);

	var subLabels = [subLabA, subLabB, subLabC];	
	
	
	normalize = function(num)	//solve for an x coordinate, given a value of raw data
	{
		return (num*(canvasWidth - canvasCutOff))/range - minValue*(canvasWidth - canvasCutOff)/range + xStart;
	}
	denormalize = function(num)	//solve for the value of raw data, given an x coordinate
	{
		return (range*(num-xStart)+minValue*(canvasWidth - canvasCutOff)) / (canvasWidth - canvasCutOff);
	}
	
	//Write the rotated sublabels text (Note these labels should be similar to each other in terms of number of characters):
	
	var barUnit = subLabelsEnd/3;
	var labelYPosition = currY-yMod*.5-topTextLabelSpacing;
	var subLabTextAttr = {"font-size": 14, 'font-family': fontFamily, "text-anchor": "start", "font-weight": "bold"};

	this.text(barUnit/2, 			labelYPosition, subLabText[0]).attr(subLabTextAttr).rotate(textRotation,	barUnit/2,			labelYPosition);
	this.text(barUnit/2+barUnit, 		labelYPosition, subLabText[1]).attr(subLabTextAttr).rotate(textRotation, 	barUnit/2+barUnit, 	labelYPosition);
	this.text(barUnit/2+2*barUnit, 	labelYPosition, subLabText[2]).attr(subLabTextAttr).rotate(textRotation, 	barUnit/2+2*barUnit, 	labelYPosition);
	
	//Create the text for the labels on the right

	this.text(normalize(maxValue) + labelsTextOffsetX + barUnit/2, labelYPosition, subLabText[3]).attr(subLabTextAttr).rotate(textRotation, normalize(maxValue) + labelsTextOffsetX + barUnit/2, labelYPosition);

	//----------- Pre-loop variable declarations for the sublabel generation 

	var lastA = "undef";		//Variables to store the last sublabel encountered in each list
	var lastB = "undef";
	var lastC = "undef";
	var lastD = "undef";
	var retA = [1, currY - yMod/2];	//Return variables. Format: [current length of sublabel, current starting Y position of sublabel]
	var retB = [1, currY - yMod/2];
	var retC = [1, currY - yMod/2];
	var retD = [1, currY - yMod/2];

	//------------

	//Enter main loop for drawing dynamically-placed elements

	for(var i = 0; i < means.length; i++)
	{	
		//Alternating gradient behind the plot
		backRect = this.rect(0, currY, canvasWidth, yMod, 0).attr({
			"fill": (i%2==0?270:90)+"-#fff-#eef",
			"stroke": "none"
		});
			
		if(i==0)
			firstBackRect = backRect;
		else
			backRect.insertBefore(firstBackRect);

		//Confidence interval bar
		var thisRect = this.rect(normalize(lowerCI[i]), currY, normalize(upperCI[i]) - normalize(lowerCI[i]), barHeight, barRoundedEdges).attr({
			"fill": "90-#043a6b-#ffffff"
		});

		//Mean within each confidence interval, or draw the diamond

		if(labels[i] == "meta_all")
		{
			var geneTipHTML = "<div id='labelFormat'>Overall meta analysis</div> <div id='clickFormat'>Position of this meta analysis diamond represents the sample size-weighted mean of the of all above effect sizes, shown here with its confidence interval of <b>"+lowerCI[i] + "</b> to <b>" +upperCI[i] + "</b>. <div id='warning'>Note: the meta analytical mean presented here is a composite that may not be accurate.</div>";
			var thisDiamond = this.rect(normalize(means[i]), currY-diamondSize*6/2-3, diamondSize*6, diamondSize*6).attr({
				"fill": "#99FFCC",				
				"stroke-dasharray": "..",
				"opacity": .5
			}).rotate(45, normalize(means[i]), currY-diamondSize*6/2-3);
			addTip(thisDiamond.node, geneTipHTML);	
		}
		else if(labels[i] == "meta")
		{
			var geneTipHTML = "<div id='labelFormat'>Submeta analysis for: "+genotypes[i]+"</div> <div id='clickFormat'>Position of this meta analysis diamond represents the sample size-weighted mean of the effect sizes specified by the criterion bars to the left, shown here with its confidence interval of <b>"+lowerCI[i] + "</b> to <b>" +upperCI[i] + "</b>";
			var thisDiamond = this.rect(normalize(means[i]), currY-diamondSize*6/2-3, diamondSize*6, diamondSize*6).attr({
				"fill": "#FFFF99",
				"opacity": .5,
				"stroke-dasharray": ".."
			}).rotate(45, normalize(means[i]), currY-diamondSize*6/2-3);
			addTip(thisDiamond.node, geneTipHTML);
		}
		else
		{
			var geneTipHTML = "<div id='labelFormat'>"+genotypes[i]+ " (n="+sampleSizes[i]+")</div> <div id='clickFormat'>This genotype comparison has an effect size of <b>" + means[i] + "</b>, which falls within a 95% confidence interval of <b>"+lowerCI[i] + "</b> to <b>" +upperCI[i] + "</b></div>";

			radius = radiusMin + ((sampleSizes[i]*(radiusMax)) / (maxSS));

			var thisElli = this.ellipse(normalize(means[i]), currY+barHeight/2,radius,radius).attr({
				"fill": "r(.5, .1)#fff-#ff4f00",
				"opacity": .5,
				"stroke-dasharray": ".."
			});
			addTip(thisElli.node, geneTipHTML);
		}

		//Text to label the mean at each row
		var oriText = this.text(normalize(means[i]), currY-1.5*radius, means[i]).attr({
			"font-size": 12, 'font-family': fontFamily,
			"text-anchor": "start"
		});

		addTip(thisRect.node, geneTipHTML);
		addTip(oriText.node, geneTipHTML);
	
		//Draw the sublabels and the vertical meanlines grouped by sublabel A. 		

		if(labels[i] != "meta_all")
		{
			retA = generateSubLabelColumn(subLabA, subLabB, subLabC, labels, this, i, means, true, subLabA, lastA, 0, retA[1], subLabelsEnd/3, retA[0], yMod, 0, subLabA[i], subLabelsEnd, canvasWidth, subLabText[0], subLabDB[0], query, subLabDB[0]); 
			retB = generateSubLabelColumn(subLabA, subLabB, subLabC, labels, this, i, means, false, subLabB, lastB, subLabelsEnd/3, retB[1], subLabelsEnd/3, retB[0], yMod, 1, subLabB[i], subLabelsEnd, canvasWidth, subLabText[1], subLabDB[1], query, subLabDB[0]);
			retC = generateSubLabelColumn(subLabA, subLabB, subLabC, labels, this, i, means, false, subLabC, lastC, 2*subLabelsEnd/3, retC[1], subLabelsEnd/3, retC[0], yMod, 2, subLabC[i], subLabelsEnd, canvasWidth, subLabText[2], subLabDB[2], query, subLabDB[0]);

			//Draw the column of labels on the right side of the plot, marking the pubMedIDs
			retD = generateSubLabelColumn(subLabA, subLabB, subLabC, labels, this, i, means, false, labels, lastD, normalize(maxValue) + labelsTextOffsetX, retD[1], subLabelsEnd/3, retD[0], yMod, 3, labels[i], subLabelsEnd, canvasWidth, articleLinkLocation + labels[i], "href", query, subLabDB[0]);
		}
		else
		{
			retA = [retA[0], retA[1]+yMod];
			retB = [retB[0], retB[1]+yMod];
			retC = [retC[0], retC[1]+yMod];
			retD = [retD[0], retD[1]+yMod];
		}

		lastA = subLabA[i];
		lastB = subLabB[i];
		lastC = subLabC[i];
		lastD = labels[i];
		
		currY += yMod;	//Increment position of the current element	
	}	//End loop
	

	//Draw the x axis on the bottom
	var xAxis = this.path("M" + normalize(minValue) + " " + currY + "L" + normalize(maxValue) + " " + currY ).attr({
		"stroke": "#679Fd2"
	});	


	var yRail1 = this.path("M" + 0 + " " + 0 + "L" + 0 + " " + currY);			//Draw a vertical line marking the left side of the canvas boundary
	var yRail2 = this.path("M" + canvasWidth + " " + 0 + "L" + canvasWidth + " " + currY);	//Draw a vertical line marking the right side of the canvas boundary

	//Draw and label a vertical line marking a landmark X value on the graph. The landmark spot is calculated by getYOrigin given the range of the data
	var ySpot = getYOrigin(minValue, maxValue);
	var yAxis = this.path("M" + normalize(ySpot) + " " + 0 + "L" + normalize(ySpot) + " " + (currY+axisTextOffsetY*2)).attr({
		stroke: "#679Fd2"
	});
	var yOriginText = this.text(normalize(ySpot)+axisTextOffsetY, currY-axisTextOffsetY, ySpot);
	
	var xt1 = this.text(normalize(minValue), currY-axisTextOffsetY, minValue);	//Label the minimum of the graph
	var xt2 = this.text(normalize(maxValue), currY-axisTextOffsetY, maxValue);	//Label the maximum of the graph
	
	//Draw the line that the user can use to measure the x value at the current position by moving the mouse 
	var yLine = this.rect(0,0,1,currY).attr({
		"stroke": "#679Fd2",
		"stroke-dasharray": "--"
	});
	//if(BrowserDetect.browser != "Explorer")
	//{
		var yLineT = this.text(0,0,0);
	//}	
	
	//Constantly set the x position of the y line to be equaal to the x position of the mouse, and label the line
	//Remove the label and move the line off canvas if the mouse leaves the defined range
	//TODO: unbind event if the toggle checkbox is unchecked

	$(document).mousemove(function(e)
	{
		var heightCSS = $('table.topCont').css('height');
		var tableHeight = heightCSS.substr(0,heightCSS.length-2);
		
		yLine.attr({x : (e.pageX< xStart + canvasWidth - canvasCutOff  && e.pageX > xStart ? (document.getElementById("displayY").checked ? e.pageX: -10) : -10)});
		yLineT.attr({
			x : e.pageX + 20,
			y: e.pageY- parseFloat(tableHeight)-200,				
			text: (e.pageX< xStart + canvasWidth - canvasCutOff && e.pageX > xStart ? (document.getElementById("displayY").checked ? roundNumber(denormalize(e.pageX),2) : "") : "")
			
		});
	});
};

/*
This function is called within the main loop, and draws the three sublabel columns at the left of the forest plot. At each iteration, this function 
determines whether or not the current sublabel is a continuation of a previous sublabel, or a new one. A rectangle will be drawn whose height represents
the entire span of each particular unique sublabel.

This function also draws in vertical lines representing the mean of data, grouped by the first sublabel.

The function returns an array of length 2, specifying:
	index 0: The current length of the current sublabel (number of times it has consecutively occured in the loop thus far)
	index 1: The current starting position ( Y value) of the current sublabel, which is a function of yMod

These function calls are quite monstrous and are used to draw all shapes that a are dependent on the consecutive ordering of items in the data array.
The shape drawing is done iteratively, with no preprocessing. 

The following parameters should be specified, but keep in mind that most of these parameters are already given from the context of where the function 
is being called: 

container		The container in which to draw the shapes		TODO eliminate this parameter
index			Current loop index
means			Array of mean values
drawMeanLine		Boolean specifying whether or not to draw a mean line for the given means
subLabelsArray		Array of Strings used to label the shapes 
lastSubLabel		The previous String in the sublabel array		TODO eliminate this parameter
currSubLabelPosX	X position for drawing this shape
currSubLabelPosY	Y position for drawing this shape
width 			Width of the shape
currLen			Height of the shape, in units (units of yMod) 
yMod			Y spacer 
colorFamily		Integer used to assign a unique color scheme to all shapes produced by this function
tTipText		String used for the tooltip when the shape is hovered over 
subLabelsEnd		X position marking the end of the lefthand area for drawing the shapes
canvasWidth		Width of the canvas
labelText		String used to for the text above the shapes, labeling what category they represent 
labelDB			The name of the SQL database variable for the labelText, or "href" if the shape is to act
			as a link. In this case, labelText should specify the url 
query			The main SQL query that produced the current plot
if(colorFamily != 3 || (tTipText != "meta" && colorFamily == 3))
		{  
TODO: Cleanup the parameters for this function
*/


function generateSubLabelColumn(subLabA, subLabB, subLabC, labels, container, index, means, drawMeanLine, subLabelsArray, lastSubLabel, currSubLabelPosX, currSubLabelPosY, width, currLen, yMod, colorFamily, tTipText, subLabelsEnd, canvasWidth,  labelText, labelDB, query, sortBy)
{
	var meanLineAttr = {
		"stroke": "#ff4f00",
		"stroke-dasharray": "--"
	};
	
	if(subLabelsArray[index] != lastSubLabel) 	//This is a new sublabel	  
		currLen = 1;
	else						//This is a continuing sublabel
		currLen++;

	if(subLabelsArray[index+1] != subLabelsArray[index]) //The next one is different
	{		
		//----------- DRAW THE SUBLABEL AND ALL ITS ASSOCIATED SHAPES AND EVENTS -------------------------------

		var x =currSubLabelPosX;
		var y =currSubLabelPosY;
		var w = width;
		var h = currLen*yMod;

		//Attribute used when the mouse hovers over the main background shape
		var rectBackHoverAttr = {
			"fill": getNextColor(tTipText, colorFamily),
			"opacity": 1,
			"stroke": "#ffff00",
			"stroke-width": 5,
			"stroke-dasharray": "none"
		};
		//Attribute used when the mouse leaves the main background shape
		var rectBackMouseoutAttr = {fill: getNextColor(tTipText, colorFamily),
			"fill": getNextColor(tTipText, colorFamily),
			"stroke": "none",
			"opacity": 1,
			"stroke-width": 1
		};
	
		//Number of pixels of space between the top rectangle (glossy shine effect) and the bottom rectangle
		var padding = 3;

		//Draw the main shape of the button
		var subRectBack = container.rect(x, y, w, h, 15).attr(rectBackMouseoutAttr);
	
		//Draw the glossy shine effect ontop of the button
		var subRect = container.rect(x+padding, y+padding, w/2-padding*1.5, h-padding*2, 10).attr({
			//Gloss is a horizontal offset gradient from the button color, to white, and back to the button color  
			"fill": "180-"+getNextColor(tTipText, colorFamily)+"-#ffffff:100-"+getNextColor(tTipText, colorFamily), 
			"opacity": .8,
			"stroke": "none",
			"stroke-width": 1,
			"stroke-dasharray": "none"
		});
	
		//Draw text labels on top of the buttons
		var buttonTextAttr = {"font-size": 14, 'font-family': '"Helvetica, Arial, sans-serif"', "text-anchor": "start", "font-weight": "bold"};
		var buttonText = truncateForButton(h, (tTipText + ""));
		if(tTipText == "meta" && colorFamily == 3)
		{
			buttonText = truncateForButton(h,"Submeta analysis"); 
		}
		var subRectText  = container.text(x+w/2, y+h-5+3, buttonText).attr(buttonTextAttr).rotate(-90, x+w/2, y+h-5);
	
		var highlightOff = {
			"stroke":"none",
			"x": -50,
			"y": -50,
			"height": 0,
			"opacity": .1	
	
		};
	
		var highlightRow = container.rect(0,0,canvasWidth + 500,50,0).attr(highlightOff);	
	
		//Add the checkbox

		var cBox = rCheckbox(container,x,y,15,15,5);	
		cBox.toFront();	
	
		cBox.click(function () 
		{		
						thisAddress = subLabA[index];
			if(colorFamily == 1)
				thisAddress += "."+trim(subLabB[index]);
			if(colorFamily == 2)
				thisAddress += "."+trim(subLabB[index])+"."+trim(subLabC[index]);	
			if(colorFamily == 3)
				thisAddress = labels[index];
				
			//TODO: Find a way to make this not browser-dependent
			var realClicked = this.clicked;
			if(BrowserDetect.browser=="Explorer")
				realClicked = !this.clicked;
			
			
			if(!realClicked)
			{
				metaAnalysisAddressList.removeItem(thisAddress);
			}
			else
			{
				metaAnalysisAddressList.push(thisAddress);
				//metaAnalysisAddressList[metaAnalysisAddressList.length] = thisAddress;
			}
		});
	
		var checkBoxTip = "<div id='labelFormat'>Meta analysis</div> <div id='clickFormat'>Click to mark <b>"+ tTipText+"</b> for meta analysis. When you are done marking, press the button above to generate a meta analysis plot.</div>";
		addTip(cBox.node, checkBoxTip);

		//Disable hovering capabilities for unsupported browsers
		//if(BrowserDetect.browser == "Opera")
		//	return;
	
		//========= HOVER EVENTS ========================
		//TODO: create functions for these to remove code duplication
		//Highlight the sublabel button on mouseover. The hover event needs to be applied to both the button and the gloss effect
		
		
		
		
		subRect.hover(function (event)
		{
		
			highlightRow.insertAfter(firstBackRect);
			subRectBack.attr(rectBackHoverAttr);
			highlightRow.attr({
				"x": subLabelsEnd,
				"y": subRectBack.attr("y"),
				"height": subRectBack.attr("height"),
				"fill": "180-"+subRectBack.attr("fill")+"-#ffffff",
				"stroke": "none",
				"stroke-width": 0
				
			
			});
		}, function (event)
		{
			
			subRectBack.attr(rectBackMouseoutAttr);
			highlightRow.attr(highlightOff);

		}).click(function () 
		{
			if(colorFamily != 3 || (tTipText != "meta" && colorFamily == 3))
			requestSort(labelText, labelDB, query);
		});
		
		//----------------------------------------------
		subRectBack.hover(function (event) 
		{
			subRectBack.attr(rectBackHoverAttr);
		
			highlightRow.insertAfter(firstBackRect);
			highlightRow.attr({
				"x": subLabelsEnd,
				"y": this.attr("y"),
				"height": this.attr("height"),
				"fill": "180-"+this.attr("fill")+"-#fff",
				"stroke": "none",
				"stroke-width": 0
			
			});
		
		}, function (event)
		{
		 	this.attr(rectBackMouseoutAttr);
			highlightRow.attr(highlightOff);
		}).click(function () 
		{
			if(colorFamily != 3 || (tTipText != "meta" && colorFamily == 3))
			requestSort(labelText, labelDB, query);
		})
		//----------------------------------------------
		subRectText.hover(function (event)
		{
			highlightRow.insertAfter(firstBackRect);
			subRectBack.attr(rectBackHoverAttr);
			highlightRow.attr({
				"x": subLabelsEnd,
				"y": subRectBack.attr("y"),
				"height": subRectBack.attr("height"),
				"fill": "180-"+subRectBack.attr("fill")+"-#fff",
				"stroke": "none",
				"stroke-width": 0
			
			});
		
		}, function (event)
		{
			subRectBack.attr(rectBackMouseoutAttr);
			highlightRow.attr(highlightOff);
		}).click(function () 
		{
			if(colorFamily != 3 || (tTipText != "meta" && colorFamily == 3))
			requestSort(labelText, labelDB, query);
		});
		
		
		//============END HOVER EVENTS==================
	
		//Add tooltip to the button. Use CSS to style labelFormat and clickFormat
	
		var tipTextHTML = "";
		if(labelDB == "href")
		{
			if(colorFamily != 3 || (tTipText != "meta" && colorFamily == 3))
				tipTextHTML = "<div id='labelFormat'>"+tTipText+"</div> <div id='clickFormat'>Click to search online for this article</div>";
			else
				tipTextHTML = "<div id='labelFormat'>Submeta analysis</div> <div id='clickFormat'>Shown here are the meta analysis diamonds for subgroups of data in this plot. The criterion bars at the left of these rows identify the subgroups for which the diamonds here are plotted.</div>";
		}	
		else
		{
			if(colorFamily > 0)
				tipTextHTML = "<div id='labelFormat'>"+tTipText+"</div> <div id='clickFormat'>Click to sort the plot data by <b>"+labelText+"</b>. These columns will be re-ordered to reflect the sort hierarchy, with <b>"+labelText+"</b> sorted alphabetically in the first column.</div>";
			else
				tipTextHTML = "<div id='labelFormat'>"+tTipText+"</div> <div id='clickFormat'>The plot is currently sorted by <b>"+labelText+"</b>. Click a Criterion Bar in another column to sort by that criterion.</div>";
		}

		addTip(subRect.node, tipTextHTML);
		addTip(subRectBack.node, tipTextHTML);
		addTip(subRectText.node, tipTextHTML);

		if(drawMeanLine)
		{	
			//The mean of this group is the mean of an array slice starting at the position of the last sublabel and ending at the current position (inclusive)
			//alert("MEAN SLICE: " + subLabelsArray.firstIndexOfLastOccurringBlock(index, lastSubLabel) + " to " + (index+1));
			var currMean = getMean(means.slice(subLabelsArray.firstIndexOfLastOccurringBlock(index, lastSubLabel), index+1));
			var yMeanLine = container.path("M" + normalize(currMean) + " " + currSubLabelPosY + "L" + normalize(currMean) + " " + (currSubLabelPosY+yMod*currLen));
			yMeanLine.attr(meanLineAttr);			
		}

		//----------- END DRAW THE SUBLABEL AND ALL ITS ASSOCIATED SHAPES AND EVENTS  -------------------------------

		currSubLabelPosY += yMod*currLen;
	}
	return [currLen, currSubLabelPosY];
}

//Draw a checkbox at (x,y) into the container specified by where

function rCheckbox(where,x,y,w,h,r)
{
	var unchecked_hoverOutAttr = 	{"fill" : "90-#fff-#ccc", "stroke" : "#000000"};
	var unchecked_hoverAttr = 	{"fill" : "90-#fff-#ffc", "stroke" : "#000000"};
	var checked_hoverOutAttr = 	{"fill" : "90-#f00-#fcc", "stroke" : "#ff0000"};
	var checked_hoverAttr = 		{"fill" : "90-#f00-#fee", "stroke" : "#ff0000"};

	var cBox = where.rect(x,y,w,h,r);
	cBox.clicked = false;
	cBox.attr(unchecked_hoverOutAttr);
	
	cBox.hover(function (event) 
	{
		if(!this.clicked)
			this.attr(unchecked_hoverAttr);
		else		
			this.attr(checked_hoverAttr);
	}, function(event)
	{
	 	if(!this.clicked)
			this.attr(unchecked_hoverOutAttr);
		else		
			this.attr(checked_hoverOutAttr);
	}).click(function () 
	{
		if(!this.clicked)
		{
			this.clicked = true;
			this.attr(checked_hoverAttr);
		}
		else	
		{
			this.clicked = false;
			this.attr(unchecked_hoverAttr)
		}
	})

	return cBox;
}

/* Returns a truncated version of a string given the how long the bounding button is (technically, its height, in pixels). The string may not need to be truncated.
*/
function truncateForButton(buttonLength, t)
{
	var maxChars = buttonLength / 11; 
	if(t.length > maxChars)
	{
		return t.substr(0,maxChars) + "...";
	}
	else return t;
}

/* 
Return a color in the form "#FF99FF".
An MD5 hash is computed for a string, and used to generate a unique color for that string
*/
function getNextColor(s, colorFamily)
{

	var color = "#" + hex_md5(trim("novak"+s)).substring(0,6);
	var mod = "";
	//Make the color 
	for(var i = 0; i < color.length; i++)
	{
		
		if	(color.charAt(i)=="0")
			mod+="B";
		else if (color.charAt(i)=="1")
			mod+="C";
		else if (color.charAt(i)=="2")
			mod+="A";
		else if (color.charAt(i)=="3")
			mod+="6";	
		else
			mod+=color.charAt(i);
			
	}
	return mod;
}		


function modularGet(index, arr)
{
	return arr[index % arr.length];
}

//Calculate the position along the x axis where the vertical line will be drawn
function getYOrigin(minValue, maxValue)
{
	if(minValue < 0)
		if(maxValue > 0)
			return 0;
		else
			return roundNumber((maxValue+minValue)/2,1);	
	else
		if(minValue > 1)
			return roundNumber((maxValue+minValue)/2,1);
		else
			return 1;
}

//Given an array of numbers, return the mean of the numbers
function getMean(arr)
{
	var t = 0;
	for(var i = 0; i < arr.length; i++)
	{
		t+= arr[i];
	}
	return t/arr.length;
}

//Round a number to the specified number of decimal places
function roundNumber(num, dec) 
{
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

//Given an array of numbers, return the lowest number
function getMin(lowerCI)
{
	var currMin = 10000000000;

	for(var i = 0; i < lowerCI.length; i++)
	{
		if(lowerCI[i] < currMin)
		{
			currMin = lowerCI[i];		
		}
	}
	return currMin;
}


function getMinInDataRange(lowerCI, labels)
{
	var currMin = 10000000000;

	for(var i = 0; i < lowerCI.length; i++)
	{
		if(labels[i] == "meta_all" || labels[i] == "meta")
			return currMin;
		if(lowerCI[i] < currMin)
		{
			currMin = lowerCI[i];		
		}
	}
	return currMin;
}

//Given an array of numbers, return the largest number
function getMax(upperCI)
{
	var currMax = -10000000000;

	for(var i = 0; i < upperCI.length; i++)
	{
		if(upperCI[i] > currMax)
		{
			currMax = upperCI[i];		
		}
	}
	return currMax;
}
function getMaxInDataRange(upperCI, labels)
{
	var currMax = -10000000000;

	for(var i = 0; i < upperCI.length; i++)
	{
		if(labels[i] == "meta_all" || labels[i] == "meta")
			return currMax;
		if(upperCI[i] > currMax)
		{
			currMax = upperCI[i];		
		}
	}
	return currMax;
}

//Remove trailing and leading spaces
function trim(s) {
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s;
}

/*
In an array having blocks of consecutive elements, this function returns the first occuring index of a search element in the last occuring block of that element starting from some search index. 

For example, given:

        0   1   2   3   4   5   6   7   8   9
arr = ["a","a","a","b","b","b","b","c","c","c"];

arr.firstIndexOfLastOccurringBlock(6, "b")
 --> returns 3

arr.firstIndexOfLastOccurringBlock(3, "a")
 --> returns 0
	
*/

Array.prototype.firstIndexOfLastOccurringBlock = function(searchIndex, searchTerm)
{
	var currHighestIndex = searchIndex;
	for(var i = searchIndex; i > 0; i--)
		if(this[i] == searchTerm)
			currHighestIndex = i;
		else
			return currHighestIndex;	
	return 0;
}

Array.prototype.removeItem = function(itemToRemove)
{
	var j = 0;
	while (j < this.length) 
	{
		if (this[j] == itemToRemove)
			this.splice(j, 1);
		else 
			j++; 
	}

	return this;
}

// =========== Handling =======================



$(document).ready(function() 
{
	if(devMode)
	{
		//If we are in development mode, launch the visualizer immediately using fake data and stop all further loading

		$("#metaDiv").fadeIn("fast");

		var canvasWidth = 1000;
		R = Raphael("holder", canvasWidth, jData1.means.length*50+150);
		R.fplot(canvasWidth, "CHRM2", jData1.means, jData1.lowerConfidenceInterval, jData1.uppperConfidenceInterval, jData1.labels, jData1.subLabelsText, jData1.subLabelsDB, jData1.subLabelsA, jData1.subLabelsB, jData1.subLabelsC, jData1.genotypes, jData1.pooledSampleSize);
		return;
	}


	//---We are live---

	//Initialize the tooltip DIV and loader

	$("#tip").hide();

	$("#spinner").hide();
	$("#spinnerIE").hide();

	if(BrowserDetect.browser != "Explorer")
	{
		$("#spinner").bind("ajaxSend", function(){
			$(this).fadeIn("fast");
		}).bind("ajaxComplete", function(){
			$(this).fadeOut("fast");
		});
	}
	else
	{
		$("#spinnerIE").bind("ajaxSend", function(){
			$(this).fadeIn("fast");
		}).bind("ajaxComplete", function(){
			$(this).fadeOut("fast");
		});
	}

	document.getElementById("displayYCheckbox").style.visibility = "hidden";
	
	$("#fb1").flexbox("/static/json_plotWhat.txt", 
	{width: 350,
	watermark: "What do you want to explore?",
	onSelect: function()
	{
		//Load data from python based on the plot type that the user selected
		var jsonSource1 = (devMode ? jGenes : "/forestPlotDropdown/?plotType="+this.value);

		//Destroy the second flexbox
		$('#fb2_input').remove();
		$('#fb2_hidden').remove();
		$('#fb2_arrow').remove();
		$('#fb2_ctr').remove();
		
		//Remake the second flexbox

		$("#fb1-r").html("<br/><br/>Please specify:").fadeIn('slow');	
		$("#fb2").flexbox(jsonSource1, 
			{width: 350,
			watermark: "Choose "+(this.value == "Genes" ? "gene" : "task")+" here",
			paging: false,  
   			maxVisibleRows: 15, 
			onSelect: function()
			{	
				if(this.value == "ALL")
				{
					if(confirm("Choosing 'ALL' will plot all of the data stored in our database, which may take awhile and may cause your browser to appear unresponsive while the forest plot is being generated. To continue, press OK."))
						launchVis(this.value, "none");
					else
						return;
				}
				else
					launchVis(this.value, "none");
			}
			}).fadeIn('slow');
	}
	});   
})


/*
Preprocess arrays so that consecutive sublabels will be split if the column before is also split
*/
function processArray(arrSource, arrToSplit)
{
	for(var i =0; i< arrSource.length; i++)
		if(arrSource[i] != arrSource[i+1])
			if(arrToSplit[i] == arrToSplit[i+1])
			{
				var labelToSplit = arrToSplit[i];
				for(var j = i+1; j< arrToSplit.length; j++)
					if(arrToSplit[j]==labelToSplit)
						arrToSplit[j]+=" ";
			}
	return arrToSplit;
}

var R;	//Raphael object

function launchVis(query, sortBy, addressList)
{	
	metaAnalysisAddressList = new Array();

	//---We are live (never call launchVis in development mode)---
	
	//TODO: Add loading code here

	//Get the JSON data and establish a success function
	//alert("/forestPlotGetData/?plotSubType=" + query + (sortBy=="none" ? "" : ("&sortBy="+sortBy)) + (addressList == undefined? "" : ("&dataFilter=" + addressList.join(";"))));

	$.getJSON("/forestPlotGetData/?plotSubType=" + query + (sortBy=="none" ? "" : ("&sortBy="+sortBy)) + (addressList == undefined? "" : ("&dataFilter=" + addressList.join("^"))), function(data)
	{
		$("#metaDiv").fadeIn("slow");

		//Attempt to die gracefully
		$("#holder").html("");
		var errorCode = 0;
		if(data.means == undefined)			
			errorCode=1;
		else if(data.means.length == 0)
			errorCode =2;
		if(errorCode != 0)
		{
			$("#holder").html("<div id='error'>Sorry! There was an error processing this request; we cannot provide these data for you at this time. [Error Code: "+errorCode+"]</div><br/>");
			return;
		}

		document.getElementById("displayYCheckbox").style.visibility = "visible";
		if(R != undefined)
		{
			//Destroy the Raphael canvas if it exists already 
			if(BrowserDetect.browser != "Explorer")
				R.remove();
		}	

		//Remake the Raphael canvas
		var canvasWidth = 1000;
		R = Raphael("holder", canvasWidth, data.means.length*50+150);
		R.fplot(canvasWidth, query, data.means, data.lowerConfidenceInterval, data.uppperConfidenceInterval, data.labels, data.subLabelsText, data.subLabelsDB, data.subLabelsA, data.subLabelsB, data.subLabelsC, data.genotypes, data.pooledSampleSize);

		$('#metasubmitbutton').unbind('click');
		$("#metasubmitbutton").click(function()
		{		
			launchVis(query, sortBy, metaAnalysisAddressList)

		});
	});
}

/* This function is called when a sublabel button is clicked. Here, a new JSON object providing a sorted version 
of the current data is requested. 
*/

function requestSort(labelText, labelDB, query)
{
	if(labelDB=="href")
		window.open(labelText);
	else
		launchVis(query, labelDB);
}

}//End if(continueLoading)
