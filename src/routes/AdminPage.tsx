import { useState, useEffect } from 'react';

interface DateEntry {
  date: string;
  word: string;
  isValid: boolean;
  errorMessage: string;
}

const AdminPage = () => {
  const generateDates = (): DateEntry[] => {
    const dates: DateEntry[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push({
        date: nextDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        word: '',
        isValid: true,
        errorMessage: ''
      });
    }
    return dates;
  };

  const [wordList, setWordList] = useState<string[]>([]);
  const [tableData, setTableData] = useState<DateEntry[]>(generateDates());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetch('/words.txt')
      .then(response => response.text())
      .then(text => {
        const words = text.split('\n').map(word => word.trim().toLowerCase());
        setWordList(words);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading words:', error);
        setIsLoading(false);
      });
  }, []);

  const validateWord = (word: string): { isValid: boolean; errorMessage: string } => {
    if (!word || word.trim() === '') {
      return { isValid: false, errorMessage: 'Word will be randomized - No word entered' };
    }
    if (word.length !== 5) {
      return { isValid: false, errorMessage: 'Word will be randomized - Must be 5 letters' };
    }
    if (!wordList.includes(word.toLowerCase())) {
      return { isValid: false, errorMessage: 'Word will be randomized - Not in word list' };
    }
    return { isValid: true, errorMessage: '' };
  };

  const handleWordChange = (index: number, value: string): void => {
    const newData = [...tableData];
    const validation = validateWord(value);
    newData[index] = { ...newData[index], word: value, isValid: validation.isValid, errorMessage: validation.errorMessage };
    setTableData(newData);
  };

  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const currentData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8 text-gray-600 text-lg">Loading word list...</div>;
  }

  return (
    <div className="flex items-center justify-center  h-full">
      <div className="w-3/5 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Wordle Admin</h1>
          <p className="text-gray-600">Set up the next 30 days of Wordle puzzles</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-full">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-100 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-100 uppercase">Word</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-100 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((row, index) => (
                  <tr key={row.date} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}> 
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={row.word}
                        onChange={(e) => handleWordChange((currentPage - 1) * rowsPerPage + index, e.target.value)}
                        className="w-40 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter 5-letter word"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {row.errorMessage ? (
                        <span className="text-red-600">{row.errorMessage}</span>
                      ) : row.word ? (
                        <span className="text-green-600">Valid word</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center p-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
