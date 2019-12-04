using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Win32.SafeHandles;

namespace adventOfCode
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello Advent Of Code!");
            var storeClient = new StoreClient($@"{System.IO.Directory.GetCurrentDirectory()}\store");
            var answer = SolveFirstDay(storeClient);
            Console.WriteLine(answer);
        }

        public static int SolveFirstDay(StoreClient storeClient)
        {
            int fuelRequirements = 0;
            var input = storeClient.GetInput(2019, 1);
            var modulesMass = input.Split(new[] { Environment.NewLine }, StringSplitOptions.None);
            foreach (var mass in modulesMass)
            {
                var fuelForModule = (int)Math.Floor(Convert.ToDouble(mass) / 3) - 2;
                fuelRequirements += fuelForModule;
                int fuelForFuel = fuelForModule;
                do
                {
                    fuelForFuel = (int)Math.Floor(Convert.ToDouble(fuelForFuel) / 3) - 2;
                    fuelForFuel = fuelForFuel > 0 ? fuelForFuel : 0;
                    fuelRequirements += fuelForFuel;
                } while (fuelForFuel > 0);
            }
            return fuelRequirements;
        }

    }

}
