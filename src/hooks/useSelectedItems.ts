import { SelectionContext } from '@/context/selection-context'
import { useContext } from 'react'
import useTableList from './useTableList'
import { table } from '@/@types'

export const useSelectedItems = (eventId?: number) => {
	const { selectedItems, setSelectedItems } = useContext(SelectionContext)
	const { tableList } = useTableList(eventId)

	const handleSingleCheckboxChange = (id: number) => {
		setSelectedItems(prev => {
			const index = prev.findIndex(item => item === id)
			if (index === -1) {
				return [...prev, id]
			}
			return [...prev.slice(0, index), ...prev.slice(index + 1)]
		})
	}

	const handleAllCheckboxChange = (value: boolean) => {
		const data = tableList
		if (value) {
			setSelectedItems(data.map(item => item.id))
		} else {
			setSelectedItems([])
		}
	}

	const filteredTableList: table[] = selectedItems.map(id => tableList.find(item => item.id === id)).filter((item): item is table => item !== undefined)

	return { selectedItems, filteredTableList, handleSingleCheckboxChange, handleAllCheckboxChange }
}
