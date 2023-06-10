const form = document.forms.namedItem("birthDate")
const yearPlaceholder = document.getElementById("year-placeholder")
const monthPlaceholder = document.getElementById("month-placeholder")
const dayPlaceholder = document.getElementById("day-placeholder")
const inputContainer = document.querySelectorAll(".input-container")
const inputsSpan = document.querySelectorAll(".inputs span")
const inputsInput = document.querySelectorAll(".inputs input")
const yearInput = document.getElementById("year-input")
const monthInput = document.getElementById("month-input")
const dayInput = document.getElementById("day-input")

function dateDiff(startingDate, endingDate) {
    let startDate = new Date(new Date(startingDate).toISOString().substring(0, 10));
    console.log(startDate)
    if (!endingDate) {
      endingDate = new Date().toISOString().substring(0, 10); 
    }

    let endDate = new Date(endingDate);
    
    if (startDate > endDate) {
      const swap = startDate;
      startDate = endDate;
      endDate = swap;
    }
    
    const startYear = startDate.getFullYear();
    const february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
    const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
    let yearDiff = endDate.getFullYear() - startYear;
    let monthDiff = endDate.getMonth() - startDate.getMonth();
    if (monthDiff < 0) {
      yearDiff--;
      monthDiff += 12;
    }
    let dayDiff = endDate.getDate() - startDate.getDate();
    if (dayDiff < 0) {
      if (monthDiff > 0) {
        monthDiff--;
      } else {
        yearDiff--;
        monthDiff = 11;
      }
      dayDiff += daysInMonth[startDate.getMonth()];
    }  
  
    return {
        year: yearDiff,
        month: monthDiff, 
        day: dayDiff
    };
}

form.addEventListener("submit", (event) => {
    event.preventDefault()

    const year = form.year.value
    const month = form.month.value
    const day = form.day.value
    const curDate = Date.now()
    const birthDate = `${year}-${month}-${day}`
    const difference = dateDiff(curDate, birthDate)

    let isValid = true
    const yearNum = Number(yearInput.value)
    const february = (yearNum % 4 === 0 && yearNum % 100 !== 0) 
    || yearNum % 400 === 0 ? 29 : 28;
    const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    inputContainer.forEach(item => {
        item.childNodes.forEach(child =>  {
            if (child.nodeName === "INPUT") {
                if (child.value === "") {
                    child.nextElementSibling.textContent = "This field is required"
                    isValid = false
                } else if (isNaN(child.value)) {
                    child.nextElementSibling.textContent = "Must be a number"
                    isValid = false
                } else if (child.id === "day-input" 
                && child.value > daysInMonth[Number(monthInput.value) - 1]) {
                    child.nextElementSibling.textContent = "Must be a valid date"
                    if ((Number(child.value) > 31 || Number(child.value) <= 0)) {
                        child.nextElementSibling.textContent = "Must be a valid day"
                    }
                    isValid = false
                } else if (child.id === "month-input" 
                && (Number(child.value) > 12 || Number(child.value) <= 0)) {
                    child.nextElementSibling.textContent = "Must be a valid month"
                    isValid = false
                } else if (child.id === "year-input" 
                && (Number(child.value) > new Date(Date.now()).getFullYear())) {
                    child.nextElementSibling.textContent = "Must be in the past"
                    isValid = false
                } else if (child.id === "year-input" 
                && (Number(child.value) <= 0 || Number(child.value) < 100)) {
                    child.nextElementSibling.textContent = "Must be a valid year"
                    isValid = false
                } else {
                    child.nextElementSibling.textContent = ""
                }
            }
        })
    })

    if (!isValid) {
        inputsSpan.forEach(item => {
            item.classList.add("error-span")
        })

        inputsInput.forEach(item => {
            item.classList.add("error-input")
        })
    
        return
    } else {
        inputsSpan.forEach(item => {
            item.classList.remove("error-span")
        })

        inputsInput.forEach(item => {
            item.classList.remove("error-input")
        })

        inputContainer.forEach(item => {
            item.childNodes.forEach(child =>  {
                if (child.nodeName === "INPUT") {
                    if (child.value !== "") {
                        child.nextElementSibling.textContent = ""
                    }
                }
            })
        })

        yearPlaceholder.textContent = difference.year
        monthPlaceholder.textContent = difference.month
        dayPlaceholder.textContent = difference.day
    }
})

