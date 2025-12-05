# Credit Card Default Visualization

This project loads a CSV dataset and visualizes numeric columns using a bar chart with filtering options.

## 📁 Project Structure

```
project-folder/
│── index.html
│── script.js
│── style.css
│── data.csv
│── README.md
```

## 🚀 How to Run the Project

### 1. Open the project in **Visual Studio Code**
- Place all files in one folder.
- Open the folder in VS Code.

### 2. Install the Live Server Extension
- In VS Code, go to **Extensions** (Ctrl+Shift+X).
- Search **Live Server** and install it.

### 3. Start the Live Server
- Right‑click `index.html` → **Open with Live Server**.
- Your webpage will open in the browser.

## 📊 Features
- Loads data from `data.csv`.
- Detects numeric columns automatically.
- Dropdown menu to choose which column to plot.
- Gender filter: **All, Male, Female**.
- Responsive bar chart using Chart.js.

## 🧠 How Filtering Works
- Gender column is `SEX` in the dataset:
  - 1 = Male
  - 2 = Female
- When you pick a gender, only the matching rows are used for calculations.

## 📝 CSV Format (Example)
```
ID,LIMIT_BAL,SEX,EDUCATION,MARRIAGE,AGE,...,default payment next month
1,20000,2,2,1,24,...,1
```
Make sure commas are used and headers are present.

## 🛠 Requirements
- Visual Studio Code
- Live Server extension
- Chart.js (loaded by CDN in `index.html`)

## 📥 Editing the CSV
If you replace the CSV file:
- Keep the header names.
- Ensure values are numeric for the columns you want to chart.

## 🧪 Troubleshooting
**Chart shows "Default column not found"**
- Means the first numeric column wasn’t detected.
- Check your CSV for:
  - Proper header row
  - No empty lines at the top

**Gender filter shows nothing**
- Check the `SEX` column:
  - Should contain only 1 or 2

## 📌 Future Improvements
- Add multiple chart types.
- Add more filter options.
- Add summary statistics.

Reference:

This readme file is made up from AI.

