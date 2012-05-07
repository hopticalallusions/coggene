import MySQLdb
import math
import sys
import re

class geneCogsDB : 

	def __init__(self) :
		self.sqlConnection=None
		self.sqlCursor=None
		self.lastSqlResult=None
		self.debugging=False
		self.linkToMySql()

	def linkToMySql (self) :
		try :
			self.sqlConnection = MySQLdb.connect(host = "localhost", user = "coggeneAdmin", passwd = "mendelian", db = "coggene_data")
			self.sqlCursor = self.sqlConnection.cursor()
		except MySQLdb.Error, e :
			print "error %d : %s" % (e.args[0], e.args[1])
			sys.exit(1)


	def executeMySQLCommand (self, mysqlcommand="") :
		if mysqlcommand == "" :
			print "blank mySQL command!"
			return False
		else :
			try :
				self.sqlCursor.execute(mysqlcommand)
			except MySQLdb.ProgrammingError, e :
				print " MySQL Warning : %s" % (e)
				print "line of data : %s" % self.currentData
			self.lastSqlResult = self.sqlCursor.fetchall()
			return True


	def getSubTypes(self, plotTypeRequest) :
		""""""
		if plotTypeRequest == "Tasks" :
			columnName = "task"
			tableName = "Measures"
		elif plotTypeRequest == "Genes" :
			columnName = "gene"
			tableName = "Genetics"
		else :
			return {"errorString" : "invalid plot type requested!"}
		self.executeMySQLCommand("select distinct " + columnName + " from " + tableName + " order by "+columnName)
		result = []
		idx = 1
		for item in self.lastSqlResult :
			if (len(item) > 0) :
				result.append({ "id" : idx, "name" : item[0]})
				idx += 1
		result.append({"id" : idx+1, "name" : "ALL"})
		return { "results" : result }


	def getUniqueNameList(self, column, table) :
		""""""
		self.executeMySQLCommand("select distinct "+column+" from "+table)
		nameList = []
		for item in self.lastSqlResult :
			if (len(item) > 0) :
				nameList.append(str(item[0]))
		return nameList


	def getRawFilteredData(self, mainSelection = "", sortBy = "", filterThing = []) :
		"""I am certain there's a better way to do this. (It's called Object Relational Mapping?)"""
		if mainSelection == "ALL" :
			mySqlQuery = "select pID, mean, error, sampleSize, gene, refSeq, genotype, task, indicator from Results, Genetics, Measures where Results.measureID = Measures.ID AND Results.geneID = Genetics.ID order by gene, refSeq, task, pID, indicator, mean desc"
			self.executeMySQLCommand(mySqlQuery)
			return {"dataResult" : self.lastSqlResult , "sorting" : "gene, refSeq, task, pID, indicator, mean" }
		taskNames = self.getUniqueNameList("task","Measures")
		geneNames = self.getUniqueNameList("gene","Genetics")
		indicatorNames = self.getUniqueNameList("indicator","Measures")
		refSeqNames = self.getUniqueNameList("refSeq","Genetics")
		pmidNames = self.getUniqueNameList("pID","Papers")
		mySqlQuery = "select pID, mean, error, sampleSize, gene, refSeq, genotype, task, indicator from Results, Genetics, Measures where Results.measureID = Measures.ID AND Results.geneID = Genetics.ID "
		if mainSelection in taskNames :
			mySqlQuery += " AND ( task = '" + mainSelection +"'"
			if sortBy == "indicator" : 
				sortString = "indicator, gene, refSeq, pID, genotype, mean"
			elif sortBy == "gene" :
				sortString = "gene, refSeq, indicator, pID, genotype, mean"
			elif sortBy == "refSeq" :
				sortString = "refSeq, indicator, gene, pID, genotype, mean"
			elif sortBy == "pID" :
				sortString = "pID, indicator, gene, refSeq, genotype, mean"
			else :
				sortString = "indicator, gene, refSeq, pID, genotype, mean"
		elif mainSelection in geneNames :
			mySqlQuery += " AND ( gene = '" + mainSelection +"'"
			if sortBy == "indicator" : 
				sortString = "indicator, task, refSeq, pID, genotype, mean"
			elif sortBy == "refSeq" :
				sortString = "refSeq, task, indicator, pID, genotype, mean"
			elif sortBy == "pID" :
				sortString = "pID, task, indicator, refSeq, genotype, mean"
			elif sortBy == "task" :
				sortString = "task, indicator, refSeq, pID, genotype, mean"
			else :
				sortString = "task, indicator, refSeq, pID, genotype, mean"
		else :
			sortString = "task, indicator, gene, pID, refSeq, genotype, mean"
		if (filterThing != []) :
			selections = []
			for filterRow in filterThing :
				if ( filterRow != '' ) and ( filterRow != [] ) :
					currentSelection = ""
					rowArray = filterRow.split(".")
					for idx in range(len(rowArray)) :
						if rowArray[idx] != "" :
							if rowArray[idx] in taskNames :
								currentSelection += " task = '" + rowArray[idx] +"'"
							elif rowArray[idx] in geneNames :
								currentSelection += " gene = '" + rowArray[idx] +"'"
							elif rowArray[idx] in indicatorNames :
								currentSelection += " indicator = '" + rowArray[idx] +"'"
							elif rowArray[idx] in refSeqNames :
								currentSelection += " refseq = '" + rowArray[idx] +"'"
							elif rowArray[idx] in pmidNames :
								currentSelection += " pID = '" + rowArray[idx] +"'"
							if (len(currentSelection) != 0 ) and (idx != (len(rowArray)-1)) :
								currentSelection += " AND"
					if currentSelection != "" :
						selections.append(currentSelection)
			if len(selections) > 0 :
				mySqlQuery += " AND ("
				for idx in range(len(selections)) :
					mySqlQuery += " (" + selections[idx] + ") "
					if idx < (len(selections)-1) :
						mySqlQuery += " OR "
				mySqlQuery += " ) )"
			else :
				mySqlQuery += " )"
		else :
			mySqlQuery += " )"
		mySqlQuery += " order by " +sortString + " desc"
		self.executeMySQLCommand(mySqlQuery)
		return {"dataResult" : self.lastSqlResult , "sorting" : sortString }




	def calculateStatistics(self, means, errors, sampleSizes ) :
		if ( sampleSizes[0] + sampleSizes[1] ) != 0 :
			pooledVar =  ( (    ((float(sampleSizes[0])-1)*float(errors[0])*float(errors[0]) )  + ((float(sampleSizes[1])-1)*float(errors[1])*float(errors[1]) )  ) / ( float(sampleSizes[0]) + float(sampleSizes[1]) )  )
			if pooledVar > 0 :
				pooledStdDev = math.sqrt( pooledVar )
				cohenD = (float(means[0]) - float(means[1]))/pooledStdDev
				stdDevDifference = math.sqrt( ((float(errors[0])*float(errors[0]))/float(sampleSizes[0])) + ((float(errors[1])*float(errors[1]))/float(sampleSizes[1])) )/pooledStdDev
				lowerCI = cohenD - 1.96 * stdDevDifference
				upperCI = cohenD + 1.96 * stdDevDifference
				return { "cohenD" : cohenD, "lowerCI" : lowerCI, "upperCI" : upperCI, "successful" : True, "pooledVar" : stdDevDifference*stdDevDifference }
		return {"successful" : False}


	def getData(self, plotDataRequest, sortBy = "", dataFilter = "") :
		""""""
		rawDataResult = self.getRawFilteredData(plotDataRequest, sortBy, dataFilter.split("^"))
		rawData = rawDataResult["dataResult"]
		sortString = rawDataResult["sorting"]
		resultIndexDict = {"pID" : 0, "mean" : 1, "error" : 2, "sampleSize" : 3, "gene" : 4, "refSeq" : 5, "genotype" : 6, "task" : 7, "indicator" : 8}
		labels = sortString.split(", ")
		dataResponse = { "labels" : [], "means" : [], "lowerConfidenceInterval" : [], "uppperConfidenceInterval" : [], "subLabelsA" : [], "subLabelsB" : [], "subLabelsC" : [], "subLabelsText" : [], "subLabelsDB" : labels, "genotypes" : [], "pooledVariance" : [], "pooledSampleSize" : []}
		labelNameLookup={"pID":"PMID","refSeq":"Reference Sequence","indicator":"Indicator","task":"Task","genotype":"Genotype", "gene":"Gene"}
		for item in dataResponse["subLabelsDB"] :
			dataResponse["subLabelsText"].append(labelNameLookup.get(item,"unknown"))
		localWeight = 0.0
		metaNumerator = 0.0
		metaDenominator = 0.0
		metaSampleSize = 0
		for currentRowIdx in range(len(rawData)-1) :
			for comparisonRowIdx in range(currentRowIdx+1, len(rawData) ) :
				samePMID = rawData[currentRowIdx][0] == rawData[comparisonRowIdx][0]
				sameGene = rawData[currentRowIdx][4] == rawData[comparisonRowIdx][4]
				sameRefSeq = rawData[currentRowIdx][5] == rawData[comparisonRowIdx][5]
				#
				forwardCompare = re.findall(rawData[currentRowIdx][6],rawData[comparisonRowIdx][6])
				backwardCompare = re.findall(rawData[comparisonRowIdx][6],rawData[currentRowIdx][6])
				if ( len(forwardCompare) > 0 ) or ( len(backwardCompare) > 0 ) :
					differentGenotype = False
				else :
					differentGenotype = True
				#
				sameTask = rawData[currentRowIdx][7] == rawData[comparisonRowIdx][7]
				sameIndicator = rawData[currentRowIdx][8] == rawData[comparisonRowIdx][8]
				#
				if samePMID and sameGene and sameRefSeq and differentGenotype and sameTask and sameIndicator :
				#if ( rawData[currentRowIdx][0] == rawData[comparisonRowIdx][0] ) and ( rawData[currentRowIdx][4] == rawData[comparisonRowIdx][4] ) and ( rawData[currentRowIdx][5] == rawData[comparisonRowIdx][5] ) and ( rawData[currentRowIdx][6] != rawData[comparisonRowIdx][6] ) and ( rawData[currentRowIdx][7] == rawData[comparisonRowIdx][7] ) and ( rawData[currentRowIdx][8] == rawData[comparisonRowIdx][8] ) :
					means = [ rawData[currentRowIdx][1] , rawData[comparisonRowIdx][1] ]
					errors = [ rawData[currentRowIdx][2] , rawData[comparisonRowIdx][2] ]
					sampleSizes = [ rawData[currentRowIdx][3] , rawData[comparisonRowIdx][3] ]
					statResult = self.calculateStatistics( means, errors, sampleSizes )
					if statResult["successful"] != False :
						dataResponse["means"].append( round(statResult["cohenD"],2) )
						dataResponse["lowerConfidenceInterval"].append( round(statResult["lowerCI"],2) )
						dataResponse["uppperConfidenceInterval"].append( round(statResult["upperCI"],2) )
						dataResponse["subLabelsA"].append(rawData[comparisonRowIdx][resultIndexDict[labels[0]]])
						dataResponse["subLabelsB"].append(rawData[comparisonRowIdx][resultIndexDict[labels[1]]])
						dataResponse["subLabelsC"].append(rawData[comparisonRowIdx][resultIndexDict[labels[2]]])
						dataResponse["labels"].append(rawData[comparisonRowIdx][resultIndexDict[labels[3]]])
						dataResponse["genotypes"].append(rawData[currentRowIdx][resultIndexDict["genotype"]]+" vs. "+rawData[comparisonRowIdx][resultIndexDict["genotype"]])
						dataResponse["pooledVariance"].append(statResult["pooledVar"])
						dataResponse["pooledSampleSize"].append(rawData[currentRowIdx][3] + rawData[comparisonRowIdx][3])
						localWeight = 1.0/statResult["pooledVar"]
						metaNumerator += localWeight * statResult["cohenD"]
						metaDenominator += localWeight
						metaSampleSize += rawData[currentRowIdx][3] + rawData[comparisonRowIdx][3] 
		if len(dataResponse["means"]) > 1 :
			metamean=metaNumerator/metaDenominator
			metastd=math.sqrt(1.0/metaDenominator)
			metaUpperCI = metamean + 1.96 * metastd
			metaLowerCI = metamean - 1.96 * metastd

			dataResponse["means"].append( round(metamean,2) )
			dataResponse["lowerConfidenceInterval"].append( round(metaLowerCI,2) )
			dataResponse["uppperConfidenceInterval"].append( round(metaUpperCI,2) )
			dataResponse["subLabelsA"].append( "meta_all" )
			dataResponse["subLabelsB"].append( "meta_all" )
			dataResponse["subLabelsC"].append( "meta_all" )
			dataResponse["labels"].append( "meta_all" )
			dataResponse["genotypes"].append( "meta_all" )
			dataResponse["pooledVariance"].append(metastd*metastd)
			dataResponse["pooledSampleSize"].append(metaSampleSize)
			for currentRowIdx in range(len(dataResponse["means"])-1) :
				localWeight = 1.0/dataResponse["pooledVariance"][currentRowIdx]
				metaNumerator = localWeight * dataResponse["means"][currentRowIdx]
				metaDenominator = localWeight
				numStudies = 1
				totalSampleSize = dataResponse["pooledSampleSize"][currentRowIdx]
				for comparisonRowIdx in range(currentRowIdx+1, len(dataResponse["means"]) ) :
					if ( dataResponse["subLabelsA"][currentRowIdx] == dataResponse["subLabelsA"][comparisonRowIdx] ) and ( dataResponse["subLabelsB"][currentRowIdx] == dataResponse["subLabelsB"][comparisonRowIdx] ) and ( dataResponse["subLabelsC"][currentRowIdx] == dataResponse["subLabelsC"][comparisonRowIdx] ) and ( dataResponse["labels"][currentRowIdx] != dataResponse["labels"][comparisonRowIdx] ) and ( dataResponse["genotypes"][currentRowIdx] == dataResponse["genotypes"][comparisonRowIdx] ) :

							localWeight = 1.0/dataResponse["pooledVariance"][comparisonRowIdx]
							metaNumerator += localWeight *  dataResponse["means"][comparisonRowIdx]
							metaDenominator += localWeight
							numStudies += 1
							totalSampleSize += dataResponse["pooledSampleSize"][comparisonRowIdx]
				if numStudies > 1 :
					metamean = metaNumerator/metaDenominator
					metastd = math.sqrt(1.0/metaDenominator)
					dataResponse["means"].append( round(metamean,2) )
					dataResponse["pooledVariance"].append(metastd*metastd)
					dataResponse["lowerConfidenceInterval"].append( round(metamean - 1.96 * metastd,2) )
					dataResponse["uppperConfidenceInterval"].append( round(metamean + 1.96 * metastd,2) )
					dataResponse["subLabelsA"].append(dataResponse["subLabelsA"][currentRowIdx])
					dataResponse["subLabelsB"].append(dataResponse["subLabelsB"][currentRowIdx])
					dataResponse["subLabelsC"].append(dataResponse["subLabelsC"][currentRowIdx])
					dataResponse["labels"].append("meta")
					dataResponse["genotypes"].append(dataResponse["genotypes"][currentRowIdx]+ " n= "+str(totalSampleSize))
					dataResponse["pooledSampleSize"].append(totalSampleSize)
		del dataResponse["pooledVariance"]
		return dataResponse

'''
from geneCogsDB import geneCogsDB
device = geneCogsDB()
device.getData("APOC3")
'''
