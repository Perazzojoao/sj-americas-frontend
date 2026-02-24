import { table } from '@/@types'

type TableLayoutBuckets = {
	topFourSeats: table[]
	mainTopFourSeats: table[]
	smallLeftTop: table[]
	smallLeftBottom: table[]
	largeRow1: table[]
	largeRow2: table[]
	largeRow3: table[]
}

type TableLayoutResult = {
	buckets: TableLayoutBuckets
	tableListForDataTable: table[]
}

const toLeftToRightOrder = (tables: table[]) => {
	const topRow = tables.filter((_, index) => index % 2 === 0)
	const bottomRow = tables.filter((_, index) => index % 2 !== 0)
	return [...topRow, ...bottomRow]
}

const reorderByIndexSequence = (tables: table[], sequence: number[]) => {
	const reordered = sequence.map(index => tables[index]).filter((table): table is table => Boolean(table))

	const usedIds = new Set(reordered.map(table => table.id))
	const remaining = tables.filter(table => !usedIds.has(table.id))

	return [...reordered, ...remaining]
}

export const buildTableLayout = (tableList: table[]): TableLayoutResult => {
	const sortedByNumber = [...tableList].sort((left, right) => left.number - right.number)
	const fourSeatTables = sortedByNumber.filter(table => table.seats <= 4)
	const eightSeatTables = sortedByNumber.filter(table => table.seats > 4)

	const mainFourSeatsRaw = fourSeatTables.filter(table => table.number <= 68).slice(0, 10)

	const halfLength = Math.ceil(mainFourSeatsRaw.length / 2)
	const smallLeftTopRaw = mainFourSeatsRaw.slice(0, halfLength)
	const smallLeftBottomRaw = mainFourSeatsRaw.slice(halfLength)
	const topFourSeatsRaw = fourSeatTables.filter(table => table.number > 68)
	const topSectionFourSeatsRaw = topFourSeatsRaw.slice(0, 10)
	const mainSectionTopFourSeatsRaw = topFourSeatsRaw.slice(10)
	const largeRow1Raw = eightSeatTables.slice(0, 20)
	const largeRow2Raw = eightSeatTables.slice(20, 38)
	const largeRow3Raw = eightSeatTables.slice(38)

	const orderedSmallLeftTopForLabel = reorderByIndexSequence(smallLeftTopRaw, [0, 1, 3, 2, 4])
	const orderedSmallLeftBottomForLabel = reorderByIndexSequence(smallLeftBottomRaw, [1, 3, 0, 2, 4])

	const orderedFourSeatsForLabel = [
		...orderedSmallLeftTopForLabel,
		...orderedSmallLeftBottomForLabel,
		...topFourSeatsRaw,
	]

	const orderedEightSeatsForLabel = [
		...toLeftToRightOrder(largeRow1Raw),
		...toLeftToRightOrder(largeRow2Raw),
		...toLeftToRightOrder(largeRow3Raw),
	]

	const fourSeatLabelById = new Map<number, string>(
		orderedFourSeatsForLabel.map((table, index) => [table.id, `B${index + 1}`]),
	)

	const eightSeatLabelById = new Map<number, string>(
		orderedEightSeatsForLabel.map((table, index) => [table.id, String(index + 1)]),
	)

	const withDisplayLabel = (table: table): table => ({
		...table,
		displayLabel: table.seats <= 4 ? fourSeatLabelById.get(table.id) : eightSeatLabelById.get(table.id),
	})

	const topFourSeats = topSectionFourSeatsRaw.map(withDisplayLabel)
	const mainTopFourSeats = mainSectionTopFourSeatsRaw.map(withDisplayLabel)
	const smallLeftTop = smallLeftTopRaw.map(withDisplayLabel)
	const smallLeftBottom = smallLeftBottomRaw.map(withDisplayLabel)
	const largeRow1 = largeRow1Raw.map(withDisplayLabel)
	const largeRow2 = largeRow2Raw.map(withDisplayLabel)
	const largeRow3 = largeRow3Raw.map(withDisplayLabel)

	const tableListForDataTable = [...orderedFourSeatsForLabel, ...orderedEightSeatsForLabel].map(withDisplayLabel)

	return {
		buckets: {
			topFourSeats,
			mainTopFourSeats,
			smallLeftTop,
			smallLeftBottom,
			largeRow1,
			largeRow2,
			largeRow3,
		},
		tableListForDataTable,
	}
}
