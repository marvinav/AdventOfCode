using System;
using System.Collections.Generic;
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
            var day = new DayFour(storeClient.GetInput(2019, 4));
            Console.WriteLine(day.Answer);
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

        public static string SolveThirdDay(StoreClient client)
        {
            var input = client.GetInput(2019, 3).Split(new[] { Environment.NewLine }, StringSplitOptions.None);
            var wires = new List<string[]>();
            var wireMap = new Dictionary<(int, int), List<WirePath>>();

            foreach (var wire in input)
            {
                wires.Add(wire.Split(",", StringSplitOptions.None));
            }

            Action<(int, int), WirePath> addToWireMap = (xy, wirePath) =>
            {
                if (wireMap.TryGetValue(xy, out var cell))
                {
                    if (cell.Count(wp => wp.WireId == wirePath.WireId) == 0)
                    {
                        cell.Add(wirePath);
                    }
                }
                else
                {
                    wireMap.Add(xy, new List<WirePath>() { wirePath });
                }
            };
            Action<int> createWireMap = (wireId) =>
            {
                int currentX = 0;
                int currentY = 0;
                int step = 0;
                foreach (var wirePath in wires[wireId])
                {
                    var value = int.Parse(wirePath.Substring(1));
                    var wireCell = new WirePath(wireId, step);
                    switch (wirePath.ElementAt(0))
                    {
                        case 'U':
                            for (int i = currentY + 1; i <= currentY + value; i++)
                            {
                                step++;
                                wireCell.StepCount = step;
                                addToWireMap((currentX, i), wireCell);
                            }
                            currentY += value;
                            break;
                        case 'D':
                            for (int i = currentY - 1; i >= currentY - value; i--)
                            {
                                step++;
                                wireCell.StepCount = step;
                                addToWireMap((currentX, i), wireCell);
                            }
                            currentY -= value;
                            break;
                        case 'R':
                            for (int i = currentX + 1; i <= currentX + value; i++)
                            {
                                step++;
                                wireCell.StepCount = step;
                                addToWireMap((i, currentY), wireCell);
                            }
                            currentX += value;
                            break;
                        case 'L':
                            for (int i = currentX - 1; i >= currentX - value; i--)
                            {
                                step++;
                                wireCell.StepCount = step;
                                addToWireMap((i, currentY), wireCell);
                            }
                            currentX -= value;
                            break;
                        default:
                            throw new Exception();
                    }
                }
            };

            for (int i = 0; i < wires.Count; i++)
            {
                createWireMap(i);
            }
            wireMap.Remove((0, 0));

            var answer = new Answer(0, 0);
            foreach (var cross in wireMap.Where(x => x.Value.Count > 1))
            {
                var distance = Math.Abs(cross.Key.Item1) + Math.Abs(cross.Key.Item2);
                var curManhattan = answer.MinimalManhattanDistance;
                answer.MinimalManhattanDistance = curManhattan == 0 || curManhattan > distance ? distance : answer.MinimalManhattanDistance;
                var steps = cross.Value[0].StepCount + cross.Value[1].StepCount;
                answer.MinimalSteps = answer.MinimalSteps == 0 || answer.MinimalSteps > steps ? steps : answer.MinimalSteps;

            }
            return $"Manhattan : {answer.MinimalManhattanDistance} \nMinimal : {answer.MinimalSteps}";
        }

        public struct WirePath
        {
            public int WireId { get; set; }
            public int StepCount { get; set; }

            public WirePath(int wireId, int stepCount)
            {
                WireId = wireId;
                StepCount = stepCount;
            }
        }

        public struct Answer
        {
            public int MinimalManhattanDistance { get; set; }
            public int MinimalSteps { get; set; }

            public Answer(int manhattan, int steps)
            {
                MinimalManhattanDistance = manhattan;
                MinimalSteps = steps;
            }
        }

    }
}
