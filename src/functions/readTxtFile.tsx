export const readTxtFile = (file: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const bookName = file.name;
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      let mcq: any = {};
      const content: any = event.target?.result;
      if (!content) {
        reject(event.target?.error);
      }

      // Split the content into lines
      const lines = content.split("\n");

      const extractBookName = (bookName: string) => {
        let formattedName = bookName.replace(/_/g, " ");

        // Remove ".txt" at the end
        if (formattedName.endsWith(".txt")) {
          formattedName = formattedName.slice(4, -4);
        }

        // Capitalize first letter of each word
        formattedName = formattedName
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return formattedName;
      };

      const returnMCQQuestionLines = (text: string) => {
        let beginningLine;
        let endingLine;
        let questionLines = [];

        //The following code can take care of every issue, Use it to find the sequesnce of 50 in a given text
        // let lines = [0, 0, 0, 0, 0, 0, 0, 0];
        // for (let j = 1; j <= 50; j++) {
        //   for (let a = 0; a < text.length; a++) {
        //     if (text[a].trim().startsWith(j + "\t")) {
        //       if (j > 8) {
        //         lines.push(a);
        //         break;
        //       }
        //     }
        //   }
        // }
        // let averageLength = true;
        // for (let l = 8; l < lines.length - 1; l++) {
        //   if (!(lines[l + 1] - lines[l] > 0 && lines[l + 1] - lines[l] < 10)) {
        //     averageLength = false;
        //   }
        // }

        // if (averageLength) {
        //   for (let i = 8; i >= 0; i--) {
        //     lines[i] = lines[i + 1] - 5;
        //   }
        // }

        // console.log(lines);
        // for (let a = 0; a < 50; a++) {
        //   console.log(text[lines[a]] + "(line: " + lines[a] + ")");
        // }

        for (let a = 0; a < text.length; a++) {
          if (text[a].trim() === "Setting") {
            if (!beginningLine) {
              beginningLine = a + 2;
            } else {
              endingLine = a;
            }
          }
        }
        if (beginningLine && endingLine) {
          for (let i = beginningLine; i < endingLine; i++) {
            questionLines.push(text[i]);
          }
        }
        return questionLines;
      };

      function removeTab(str: string, character: string): string {
        let newFilter = character + "\t";
        const regex = new RegExp(newFilter, "g");
        return str.replace(regex, "");
      }

      function removeOptionTab(str: string, character: string): string {
        let newFilter = character + "\t" + "q\t";
        const regex = new RegExp(newFilter, "g");
        return str.replace(regex, "");
      }

      const seperateQuestions = (questions: string[]) => {
        let missingQuestions = [];
        let questionsObject: any = {};
        let questionIndex = 1;
        let questionIndexEnd: number = 0;

        while (questionIndex < 50) {
          for (let lineIndex = 0; lineIndex < questions.length; lineIndex++) {
            let type = "";
            if (questionIndex <= 10) {
              type = "Setting";
            } else if (questionIndex <= 20) {
              type = "Characters";
            } else if (questionIndex <= 30) {
              type = "Dialogue";
            } else if (questionIndex <= 40) {
              type = "Vocabulary";
            } else if (questionIndex <= 50) {
              type = "Plot";
            }
            if (questions[lineIndex].includes(questionIndex + "\t")) {
              questionsObject[questionIndex] = {
                question: removeTab(questions[lineIndex], questionIndex + ""),
                a: removeOptionTab(questions[lineIndex + 1], "a"),
                b: removeOptionTab(questions[lineIndex + 2], "b"),
                c: removeOptionTab(questions[lineIndex + 3], "c"),
                d: removeOptionTab(questions[lineIndex + 4], "d"),
                type: type,
              };

              questionIndexEnd = lineIndex + 5;

              questionIndex += 1;
            }
          }

          if (questionIndex <= 50) {
            missingQuestions.push(questionIndex);
            questionIndex += 1;
          }
        }

        return {
          questions: questionsObject,
          missingQuestions: missingQuestions,
          answerKeyIndex: questionIndexEnd,
          bookName: extractBookName(bookName),
        };
      };

      const addAnswerKeysToQuestionsObject = (
        answersList: string[],
        answerKeyIndex: number
      ) => {
        const answerKey = isolateMCQAnswerKeys(answersList, answerKeyIndex);
        return answerKey;
      };
      // Seperate the MCQ questions
      const isolateMCQ = (questions: string) => {
        const mcqQuestionLines = returnMCQQuestionLines(questions);

        const questionsObject = seperateQuestions(mcqQuestionLines);

        //seperate MCQ Questions
        return questionsObject;
      };

      const isolateMCQAnswerKeys = (
        text: string[],
        answerKeyStartingIndex: number
      ) => {
        let answerKeyIndex = 1;
        let answerKeysObject: any = {};
        while (answerKeyIndex < 50) {
          for (
            let lineIndex = answerKeyStartingIndex;
            lineIndex < text.length;
            lineIndex++
          ) {
            if (text[lineIndex].startsWith(answerKeyIndex + "")) {
              answerKeysObject[answerKeyIndex + ""] = removeTab(
                text[lineIndex],
                answerKeyIndex + ""
              );
              answerKeyIndex += 1;
            }
          }
          answerKeyIndex += 1;
        }
        return answerKeysObject;
      };

      // Convert the lines to HTML

      mcq = isolateMCQ(lines);
      const answerKey = addAnswerKeysToQuestionsObject(
        lines,
        mcq.answerKeyIndex
      );
      mcq.answerKey = answerKey;

      mcq.bookName = extractBookName(bookName);
      delete mcq["answerKeyIndex"];
      resolve(mcq);
    };

    fileReader.readAsText(file);
  });
};
