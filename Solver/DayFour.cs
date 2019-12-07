using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Win32.SafeHandles;

namespace adventOfCode
{
    class DayFour
    {
        readonly string _input;
        readonly int _start = 0;
        readonly int _end = 0;
        private int _answersOnFirst = 0;

        private int _answersOnSecond = 0;

        public DayFour(string input)
        {
            _input = input;
            _start = Int32.Parse(input.Split("-")[0]);
            _end = Int32.Parse(input.Split("-")[1]);
            Solve();
        }

        public void Solve()
        {
            int answersOnFirst = 0;
            int answerOnSecond = 0;

            for (int i = _start; i <= _end; i++)
            {
                if (CheckTwoAdjacentRule(i))
                {
                    if (CheckDecreaseRule(i))
                    {
                        answersOnFirst++;
                        answerOnSecond = CheckCorrectedTwoAdjacentRule(i) ? answerOnSecond + 1 : answerOnSecond;

                    }
                }

            }
            _answersOnFirst = answersOnFirst;
            _answersOnSecond = answerOnSecond;

        }

        public string Answer => $"First answer : {_answersOnFirst} \nSecond answer : {_answersOnSecond}";

        public bool CheckTwoAdjacentRule(int password)
        {
            var stringPassword = Convert.ToString(password);
            for (int i = 0; i < 10; i++)
            {
                if (stringPassword.Contains($"{i}{i}"))
                {
                    return true;
                }
            }
            return false;
        }

        public bool CheckDecreaseRule(int password)
        {
            var passwordValues = password.ToString().Select(sInt => Convert.ToInt32(sInt)).ToArray();
            for (int i = 0; i < passwordValues.Length - 1; i++)
            {
                if (passwordValues[i + 1] < passwordValues[i])
                {
                    return false;
                }
            }
            return true;
        }

        public bool CheckCorrectedTwoAdjacentRule(int password)
        {
            var stringPassword = Convert.ToString(password);
            for (int i = 0; i < 10; i++)
            {
                if (stringPassword.Contains($"{i}{i}"))
                {
                    if (!stringPassword.Contains($"{i}{i}{i}"))
                    {
                        return true;
                    }
                }
            }
            return false;
        }

    }
}
