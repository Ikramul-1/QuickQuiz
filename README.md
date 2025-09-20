# QuickQuizzing
A dead simple quizzing app.

![Default look.](img/ScreenShot2025-09-20%20131218.png)
![](img/ScreenShot2025-09-20%20131306.png)
![Using Nord theme.](img/ScreenShot2025-09-20%20131445.png)
![On mobile](img/ScreenShotMobile2025-09-20%20131522.png)

### Usage
- Upload a `.csv` or a `.txt` file with your quizzes. This file must contain a header similar to this: 
    ```csv
    Question,Answer,Option1,Option2,Option3,Option4
    ```
- Set the number of questions, time, and other checkboxes.
- Hit start.

The example questions were generated using Gemini. With a prompt something like this:
```text
Generate [NUMBER OF QUESTIONS] questions about [TOPIC]. Generate in .csv format.
The header should be: Question,Answer,Option1,Option2,Option3,Option4
Surround all the field entries with double-qoutes and seperate them using commas.
Make sure that Option2 is always the answer.
```

**Note:** Making Option2 the answer isn't necessary. This is just so that Gemini DOES put the answer in the options. The app doesn't check that 😅 (sorry).

Website: https://quickquizzing.netlify.app

Also, sorry for the inconsistency with the repo name and domain. The domain quickquiz wasn't available 🙂, so I changed the things I could. I'm too lazy to move to a new repo 😅.

Modules used:
- [PapaParse](https://www.papaparse.com): For parsing the `.csv` or provided quiz file.
