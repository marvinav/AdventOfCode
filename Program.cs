using System;
using System.IO;
using System.Linq;
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
            var answer = SolveSecondDay(storeClient);
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

        public static int? SolveSecondDay(StoreClient client)
        {
            var input = client.GetInput(2019, 2).Split(",", StringSplitOptions.None);
            int target = 19690720;
            int? result = null;
            for (int noun = 0; noun < input.Length; noun++)
            {
                for (int verb = 0; verb < input.Length; verb++)
                {
                    var opcodes = input.Select(Int32.Parse).ToArray();
                    opcodes[1] = noun;
                    opcodes[2] = verb;
                    bool isRun = true;
                    int i = 0;
                    while (isRun)
                    {
                        switch (opcodes[i])
                        {
                            case 1:
                                opcodes[opcodes[i + 3]] = opcodes[opcodes[i + 1]] + opcodes[opcodes[i + 2]];
                                i += 4;
                                break;
                            case 2:
                                opcodes[opcodes[i + 3]] = opcodes[opcodes[i + 1]] * opcodes[opcodes[i + 2]];
                                i += 4;
                                break;
                            case 99:
                                isRun = false;
                                Console.WriteLine("Program halted due to 99 opcode.");
                                break;
                            default:
                                isRun = false;
                                Console.WriteLine("Program halted due to invalid opcode.");
                                break;
                        }
                    }
                    if (opcodes[0] == target)
                    {
                        result = noun * 100 + verb;
                        return result;
                    }
                }
            }
            return result;
        }
    }
}
