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
      return {
        isValid: false,
        errorMessage: 'Word will be randomized - No word entered'
      };
    }
    
    if (word.length !== 5) {
      return {
        isValid: false,
        errorMessage: 'Word will be randomized - Must be 5 letters'
      };
    }

    if (!wordList.includes(word.toLowerCase())) {
      return {
        isValid: false,
        errorMessage: 'Word will be randomized - Not in word list'
      };
    }

    return {
      isValid: true,
      errorMessage: ''
    };
  };

  const handleWordChange = (index: number, value: string): void => {
    const newData = [...tableData];
    const validation = validateWord(value);
    
    newData[index] = {
      ...newData[index],
      word: value,
      isValid: validation.isValid,
      errorMessage: validation.errorMessage
    };
    
    setTableData(newData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600 text-lg">Loading word list...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Wordle Admin</h1>
          <p className="text-gray-600">Set up the next 30 days of Wordle puzzles</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-full">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                    Word
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tableData.map((row, index) => (
                  <tr 
                    key={row.date} 
                    className={`
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      hover:bg-blue-50 transition-colors duration-150
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{row.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={row.word}
                        onChange={(e) => handleWordChange(index, e.target.value)}
                        className="w-40 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm
                          placeholder-gray-400
                          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                          transition-all duration-150"
                        placeholder="Enter 5-letter word"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.errorMessage ? (
                        <div className="flex items-center">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                          <span className="text-sm text-red-600">{row.errorMessage}</span>
                        </div>
                      ) : row.word ? (
                        <div className="flex items-center">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          <span className="text-sm text-green-600">Valid word</span>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;