import { table } from '@/@types'
import { SelectionContext } from '@/context/selection-context'
import { useContext } from 'react'
import useTableList from './useTableList'

export const useSelectedItems = (eventId?: number) => {
	const { selectedItems, setSelectedItems } = useContext(SelectionContext)
	const { tableList } = useTableList(eventId)
	const safeTableList = Array.isArray(tableList) ? tableList : []

	const handleSingleCheckboxChange = (id: number) => {
		setSelectedItems(prev => {
			const index = prev.findIndex(item => item === id)
			if (index === -1) {
				return [...prev, id]
			}
			return [...prev.slice(0, index), ...prev.slice(index + 1)]
		})
	}

	const handleAllCheckboxChange = (value: boolean, tableIds?: number[]) => {
		if (value) {
			if (tableIds && tableIds.length > 0) {
				setSelectedItems(tableIds)
				return
			}

			setSelectedItems(safeTableList.map(item => item.id))
		} else {
			setSelectedItems([])
		}
	}

	const filteredTableList: table[] = selectedItems
		.map(id => safeTableList.find(item => item.id === id))
		.filter((item): item is table => item !== undefined)

	return { selectedItems, filteredTableList, handleSingleCheckboxChange, handleAllCheckboxChange }
}
