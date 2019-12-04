using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Win32.SafeHandles;

namespace adventOfCode
{
    public class StoreClient
    {
        private readonly string _storeDir;
        public StoreClient(string storeDir)
        {
            _storeDir = storeDir;
        }

        public string GetInput(int year, int day)
        {
            return File.ReadAllText($"{_storeDir}\\{year}\\{day}.txt");

        }

    }
}
