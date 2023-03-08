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

      const retutnMCQQuestionLines = (text: string) => {
        let beginningLine;
        let endingLine;
        let questionLines = [];
        for (let a = 0; a < text.length; a++) {
          if (text[a] === "Setting") {
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
            if (questions[lineIndex].includes(questionIndex + "\t")) {
              questionsObject[questionIndex] = {
                question: removeTab(questions[lineIndex], questionIndex + ""),
                a: removeOptionTab(questions[lineIndex + 1], "a"),
                b: removeOptionTab(questions[lineIndex + 2], "b"),
                c: removeOptionTab(questions[lineIndex + 3], "c"),
                d: removeOptionTab(questions[lineIndex + 4], "d"),
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
        const mcqQuestionLines = retutnMCQQuestionLines(questions);

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
