import { table } from '@/@types'

type LayoutBucket = 'topFourSeats' | 'smallLeftTop' | 'smallLeftBottom' | 'largeRow1' | 'largeRow2' | 'largeRow3'

type LayoutRow = {
	id: string
	bucket: LayoutBucket
	className: string
	itemClassName?: (table: table) => string
}

type MapLayout = {
	topSection: {
		wrapperClassName: string
		titleClassName: string
		rowClassName: string
		bucket: LayoutBucket
		title: string
	}
	mainSection: {
		wrapperClassName: string
		headers: {
			smallClassName: string
			largeClassName: string
		}
		smallColumnClassName: string
		largeColumnClassName: string
		smallRows: LayoutRow[]
		largeRows: LayoutRow[]
	}
}

export const MAP_LAYOUT: MapLayout = {
	topSection: {
		wrapperClassName: 'grid grid-cols-5 gap-1 sm:gap-5 max-w-[560px] pl-3 sm:pl-5 lg:pl-6',
		titleClassName:
			'grid-flow-row col-span-full col-start-1 text-center border-b-2 border-primary text-xs sm:text-lg pb-2 mb-2 sm:mb-0 grow',
		rowClassName: 'grid grid-flow-col col-span-full col-start-1 gap-2 sm:gap-4 w-fit justify-start items-center grow',
		bucket: 'topFourSeats',
		title: 'Mesas Topo',
	},
	mainSection: {
		wrapperClassName: 'grid col-span-2 row-span-3 gap-1 sm:gap-5 justify-center items-center',
		headers: {
			smallClassName: 'text-center border-b-2 border-primary text-xs sm:text-lg pb-2 mb-2 sm:mb-0',
			largeClassName: 'text-center border-b-2 border-primary text-xs sm:text-lg pb-2 mb-2 sm:mb-0',
		},
		smallColumnClassName:
			'flex flex-col justify-between items-center gap-[66px] sm:gap-[104px] col-start-1 row-start-2 col-end-1 row-end-2',
		largeColumnClassName: 'flex flex-col gap-2 sm:gap-4 items-end col-start-2 row-start-2 col-end-2 row-end-2',
		smallRows: [
			{
				id: 'small-left-top',
				bucket: 'smallLeftTop',
				className: 'grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit',
				itemClassName: table => (table.number === 1 ? 'row-span-2' : ''),
			},
			{
				id: 'small-left-bottom',
				bucket: 'smallLeftBottom',
				className: 'grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit',
				itemClassName: table => (table.number === 6 ? 'row-span-2 row-start-2 row-end-2' : ''),
			},
		],
		largeRows: [
			{
				id: 'large-row-1',
				bucket: 'largeRow1',
				className: 'grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit',
			},
			{
				id: 'large-row-2',
				bucket: 'largeRow2',
				className: 'grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit',
			},
			{
				id: 'large-row-3',
				bucket: 'largeRow3',
				className: 'grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit',
			},
		],
	},
}
