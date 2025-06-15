import React from 'react'

const SubsTableItem = ({email,mongoId,date,handleDelete}) => {

    const emailDate = new Date(date);

  return (
    <div>
<tr className='bg-white border-b text-left'>
<th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
    {email ? email : "No email provided"}
</th>
<td className='px-6 py-4 hidden sm:block'>
    {new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })}
</td>
<td className='px-6 py-4 '>
    <button
    onClick={() => handleDelete(mongoId)}
        className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
        aria-label="Delete subscription"
    >
        ×
    </button>
    </td>
</tr>
    </div>
  )
}

export default SubsTableItem
