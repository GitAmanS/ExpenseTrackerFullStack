

// Function to add rows to the table
const token = localStorage.getItem("token");
var selectedCurrency = getCurrency() || "";



updateIncomeBalance();
updateExpenseBalance();
updateClosingBalance();

function addRowsToTable(income) {
  var tbody = document.getElementById("incomeTableBody");
  var tableContent = "";

  tableContent += `<div><tr onclick="showHideRow('hidden_row${income.id}')">
    <td  class="p-2">${income.IncomeCategory}</td>
    <td class="p-2 text-right">${selectedCurrency} ${income.IncomeAmount}</td>
  </tr>
  <tr id="hidden_row${income.id}" class="py-1 hidden_row"> 
    <td>
    ${income.IncomeDescription}
    </td>
    <td colspan=4 class="ml-auto"> 
      
      <button class="btn-delete" onclick="deleteRow(this,${income.id})">Delete</button>
      <button class="btn-update " onclick="updateRow(this)">Update</button>
    </td> 
  </tr></div> `;

  tbody.innerHTML += tableContent;
}

// Functions for delete and update
async function deleteRow(btn, incomeId) {
  try {
    const response = await axios.delete(
      `http://localhost:3000/income/deleteIncome/${incomeId}`,
      { headers: { Authorization: token } }
    );
    updateIncomeBalance();
    console.log("income deleted:", response.data);
    // Handle success if needed
  } catch (error) {
    console.error("Error deleting income:", error);
    // Handle error if needed
  }
  console.log(incomeId);
  // Find the visible row and remove it
  var visibleRow = btn.parentNode.parentNode.previousElementSibling;
  visibleRow.parentNode.removeChild(visibleRow);

  // Find the hidden row and remove it
  var hiddenRow = btn.parentNode.parentNode;
  hiddenRow.parentNode.removeChild(hiddenRow);
}

function updateRow(btn) {
  // Implement update logic here
  // For example, you can access the row and modify its content
  var row = btn.parentNode.parentNode;
  // Perform update operations
}

async function addNewIncome(e) {
  e.preventDefault();
  var selectedDate = $('#dailyDatepicker').val();

  let incomeAmount = e.target.incomeAmount.value;
  let incomeDescription = e.target.incomeDescription.value;
  let incomeCategory = e.target.incomeName.value;
  let income = {
    incomeAmount: incomeAmount,
    incomeDescription: incomeDescription,
    incomeCategory: incomeCategory,
    incomeDate:selectedDate,
  };

  try {
    const response = await axios.post(
      "http://localhost:3000/income/addIncome",
      income,
      { headers: { Authorization: token } }
    );
    console.log(response.data.income);
    // Assuming the server sends back the newly created income
    addRowsToTable(response.data.income);
  } catch (error) {
    console.error(error);
  }
  updateIncomeBalance();
}
const parseJwt = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};



window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  if (decodedToken.isPremiumUser) {
    document.getElementById("rzp-button1").style.display = "block";
    document.getElementById("pdfDownloadbtn").style.display = "block";
    document.getElementById("message").innerHTML = "You are a premium user now";
    displayLeaderboard();
    getAllExpenseLinks()
  }
  axios
    .get("http://localhost:3000/income/getAllIncomes", {
      headers: { Authorization: token },
    })
    .then((res) => {
      console.log("fetched:" + res.data);
      var data = res.data;
      data.forEach((item) => {
        addRowsToTable(item);
      });
    })
    .catch((err) => {
      console.log("Error fetching data:", err);
    });
});

async function buyPremium(e) {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "http://localhost:3000/purchase/premiumMembership",
    { headers: { Authorization: token } }
  );
  var options = {
    key: res.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: res.data.order.id, // For one time payment
    // This handler function will handle the success payment
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:3000/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );
      console.log(res);

      // alert(
      //   "Welcome to our Premium Membership, You have now access to Reports and LeaderBoard"
      // );
      document.getElementById("rzp-button1").style.display = "none";
      document.getElementById("primium-feature").style.display = "block";
      document.getElementById("pdfDownloadbtn").style.display = "block";
      document.getElementById("message").innerHTML =
        "You are a premium user now";
      localStorage.setItem("token", res.data.token);
      displayLeaderboard();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", (response) => {
    console.log(response.error.code);
    console.log(response.error.description);
    alert(`Something went wrong`);
  });
}

// Function to fetch leaderboard data using Axios
async function fetchLeaderboardData() {
  try {
    const response = await axios.get(
      "http://localhost:3000/premium/showLeaderBoard",
      { headers: { Authorization: token } }
    );
    return response.data.userLeaderboardDetails;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}




//PAGE FUNCTIONALITY
function showHideRow(row) { 
  $("#" + row).toggle(); 
} 
$(document).ready(function () {
  // Daily Datepicker
  $('#dailyDatepicker').datepicker({
      format: 'yyyy-mm-dd',
      autoclose: true
  });

  // Monthly Datepicker
  $('#monthlyDatepicker').datepicker({
      format: 'yyyy-mm',
      viewMode: 'months',
      minViewMode: 'months',
      autoclose: true
  });

  // Yearly Datepicker
  $('#yearlyDatepicker').datepicker({
      format: 'yyyy',
      viewMode: 'years',
      minViewMode: 'years',
      autoclose: true
  });
});


$(document).ready(function () {
  // Initialize Datepicker
  $('#dailyDatepicker').datepicker({
      format: 'yyyy-mm-dd',
      autoclose: true,
      startDate: '0d', // Set the minimum date to today
  }).datepicker('setDate', new Date()); // Set default date to today
});

function saveCurrency() {
  selectedCurrency = document.getElementById("currencySelect").value;
  localStorage.setItem("selectedCurrency", selectedCurrency);
  console.log(localStorage.getItem("selectedCurrency"));
}
function getCurrency(){

  return localStorage.getItem("selectedCurrency");
}
window.onload = function () {
  var savedCurrency = localStorage.getItem("selectedCurrency");
  if (savedCurrency) {
    selectedCurrency = savedCurrency;
    document.getElementById("currencySelect").value = savedCurrency;
  }
};

var sumOfIncome =0;
var sumOfExpenses = 0;
function updateIncomeBalance() {
  axios
    .get("http://localhost:3000/income/getTotalIncomes", {
      headers: { Authorization: token },
    })
    .then((res) => {
      console.log("fetched:" + res.data);
      var data = res.data || "0.00";
      sumOfIncome = data.totalIncome;
      var totalIncome = document.getElementById("totalIncome");

      let content = "";

      content += `<tr>
        <th class="p-2">Total Income (Credit)</th>
        <th class="p-2 text-right">${selectedCurrency}${sumOfIncome}</th>
      </tr>`;

      // Replace the content instead of appending
      totalIncome.innerHTML = content;
      updateClosingBalance();
    })
    .catch((err) => {
      console.log("Error fetching data:", err);
    });
}

function updateExpenseBalance() {
  axios
    .get("http://localhost:3000/expense/getTotalExpenses", {
      headers: { Authorization: token },
    })
    .then((res) => {
      console.log("fetched:" + res.data);
      var data = res.data || "0.00";
      console.log(data);
      sumOfExpenses = data.totalExpense;
      var totalExpense = document.getElementById("totalExpense");

      let content = "";

      content += `<tr>
        <th class="p-2">Total Expense (Debit)</th>
        <th class="p-2 text-right">${selectedCurrency}${sumOfExpenses}</th>
      </tr>`;

      // Replace the content instead of appending
      totalExpense.innerHTML = content;
      updateClosingBalance();
    })
    .catch((err) => {
      console.log("Error fetching data:", err);
    });
}

function updateClosingBalance(){
  var finalbalance = sumOfIncome-sumOfExpenses;
  var totalExpense = document.getElementById("totalBalance");

      let content = "";

      content += `<tr>
      <th class="p-2">C/F</th>
      <th class="p-2 text-right">${selectedCurrency}${finalbalance}</th>
    </tr>`;

      // Replace the content instead of appending
      totalExpense.innerHTML = content;
}



// Handle expenses





// -----



// updateBalance();


function addRowsToExpenseTable(Expense) {
  var tbody2 = document.getElementById("expenseTableBody");
  var tableContent = "";

  tableContent += `<div><tr onclick="showHideRow('hidden_rowE${Expense.id}')">
    <td  class="p-2">${Expense.ExpenseCategory}</td>
    <td class="p-2 text-right">${selectedCurrency} ${Expense.ExpenseAmount}</td>
  </tr>
  <tr id="hidden_rowE${Expense.id}" class="py-1 hidden_row"> 
    <td>
    ${Expense.ExpenseDescription}
    </td>
    <td colspan=4 class="ml-auto"> 
      
      <button class="btn-delete" onclick="deleteExpenseRow(this,${Expense.id})">Delete</button>
      <button class="btn-update " onclick="updateRow(this)">Update</button>
    </td> 
  </tr></div> `;

  tbody2.innerHTML += tableContent;
}

// Functions for delete and update
async function deleteExpenseRow(btn, ExpenseId) {
  try {
    const response = await axios.delete(
      `http://localhost:3000/expense/deleteExpense/${ExpenseId}`,
      { headers: { Authorization: token } }
    );
    updateIncomeBalance();
    console.log("Expense deleted:", response.data);
    // Handle success if needed
  } catch (error) {
    console.error("Error deleting Expense:", error);
    // Handle error if needed
  }
  console.log(ExpenseId);
  updateExpenseBalance();
  // Find the visible row and remove it
  var visibleRow = btn.parentNode.parentNode.previousElementSibling;
  visibleRow.parentNode.removeChild(visibleRow);

  // Find the hidden row and remove it
  var hiddenRow = btn.parentNode.parentNode;
  hiddenRow.parentNode.removeChild(hiddenRow);
}

function updateExpenseRow(btn) {
  // Implement update logic here
  // For example, you can access the row and modify its content
  var row = btn.parentNode.parentNode;
  // Perform update operations
}

async function addNewExpense(e) {
  e.preventDefault();
  var selectedDate = $('#dailyDatepicker').val();

  let ExpenseAmount = e.target.expenseAmount.value;
  let ExpenseDescription = e.target.description.value;
  let ExpenseCategory = e.target.expenseName.value;
  let Expense = {
    ExpenseAmount: ExpenseAmount,
    ExpenseDescription: ExpenseDescription,
    ExpenseCategory: ExpenseCategory,
    ExpenseDate:selectedDate,
  };

  try {
    const response = await axios.post(
      "http://localhost:3000/expense/addExpense",
      Expense,
      { headers: { Authorization: token } }
    );
    console.log(response.data.Expense);
    // Assuming the server sends back the newly created Expense
    addRowsToExpenseTable(response.data.Expense);
  } catch (error) {
    console.error(error);
  }
  updateExpenseBalance();
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);

  // Set up pagination variables
  let currentPage = 1;
  let hasMorePages = true;
  let perPage = getPerPageFromStorage() || 10; // Get from storage or default to 10

  // Function to get perPage from user preferences (localStorage)
  function getPerPageFromStorage() {
    return parseInt(localStorage.getItem("perPage"), 10);
  }

  // Function to set perPage in user preferences (localStorage)
  function setPerPageInStorage(value) {
    localStorage.setItem("perPage", value.toString());
  }

  // Function to fetch expenses based on page
  const fetchExpenses = async (page, perPage) => {
    try {
      const response = await axios.get(`http://localhost:3000/expense/getAllExpenses?page=${page}&perPage=${perPage}`, {
        headers: { Authorization: token },
      });

      return response.data;
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  // Function to update the expense table with new data
  const updateExpenseTable = (data) => {
    document.getElementById("expenseTableBody").innerHTML = "";
    data.forEach((item) => {
      addRowsToExpenseTable(item);
    });
  };

  // Function to disable/enable next button based on whether there are more pages
  const updateNextButton = () => {
    const nextButton = document.getElementById("nextPage");
    nextButton.disabled = !hasMorePages;
  };

  // Function to handle items per page change
  window.handleItemsPerPageChange = () => {
    perPage = parseInt(document.getElementById("itemsPerPage").value, 10);
    setPerPageInStorage(perPage); // Store in user preferences
    fetchExpenses(currentPage, perPage).then((data) => {
      updateExpenseTable(data);
      hasMorePages = data.length > 0;
      updateNextButton();
    });
  };

  // Initial fetch and update
  fetchExpenses(currentPage, perPage).then((data) => {
    console.log("fetched:", data);
    updateExpenseTable(data);
    hasMorePages = data.length > 0;
    updateNextButton();
  });

  // Set initial value for items per page
  document.getElementById("itemsPerPage").value = perPage;

  // Pagination event listeners
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchExpenses(currentPage, perPage).then((data) => {
        updateExpenseTable(data);
        hasMorePages = true;
        updateNextButton();
      });
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    if (hasMorePages) {
      currentPage++;
      fetchExpenses(currentPage, perPage).then((data) => {
        updateExpenseTable(data);
        hasMorePages = data.length > 0;
        updateNextButton();
      });
    }
  });
});







document.addEventListener('DOMContentLoaded', function () {
  // Get all tabs and tab content
  var tabs = document.querySelectorAll('.nav-link');
  var tabContents = document.querySelectorAll('.tab-pane');

  // Function to hide all tab content
  function hideAllTabs() {
      tabContents.forEach(function (tab) {
          tab.classList.remove('show', 'active');
      });
  }

  // Function to show the selected tab content
  function showTab(tabId) {
      var selectedTab = document.querySelector(tabId);
      selectedTab.classList.add('show', 'active');
  }

  // Event listener for tab clicks
  tabs.forEach(function (tab) {
      tab.addEventListener('click', function (event) {
          event.preventDefault();
          hideAllTabs();
          showTab(this.getAttribute('href'));
      });
  });
});
async function downloadPDF() {

  await axios.get("/expense/download", {
    headers: { Authorization: token },
  })
    .then((response) => {
      if (response.status === 200) {
        var a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = "myexpense.csv";
        a.click();
      }
    })
    .catch((err) => {
      console.log(err);
    });
  

}
async function getAllExpenseLinks() {
  const linksButton = document.getElementById("links-tab");
  linksButton.addEventListener("click", async () => {
    console.log("Button clicked!");

    try {
      const response = await axios.get("/expense/getAllLinks", {
        headers: { Authorization: token },
      });

      if (response.status === 200) {
        const linksContainer = document.getElementById("linksContainer");
        linksContainer.innerHTML = ""; // Clear previous content

        const expenseLinks = response.data.expenseLinks;

        if (expenseLinks.length > 0) {
          const ul = document.createElement("ul");

          expenseLinks.forEach((link) => {
            const li = document.createElement("li");
            const a = document.createElement("a");

            a.href = link.url;
            a.textContent = `Link ${link.id}`; // You can customize the label

            li.appendChild(a);
            ul.appendChild(li);
          });

          linksContainer.appendChild(ul);
        } else {
          linksContainer.textContent = "No expense links available.";
        }
      }
    } catch (error) {
      console.error("Error getting expense links:", error);
    }
  });
}

// Display leaderboard function
async function displayLeaderboard() {
  const leaderboardButton = document.getElementById("leaderboard-tab");
  // leaderboardButton.style.display = "block";

  leaderboardButton.addEventListener("click", async () => {
    console.log("Button clicked!");
    document.getElementById("leaderboardContainer").style.display = "block";
    const leaderboardBody = document.getElementById("leaderboardBody");
    // Clear previous content

    try {
      leaderboardBody.innerHTML = ""; 
      const userLeaderboardDetails = await fetchLeaderboardData();
      console.log(userLeaderboardDetails);
      
      userLeaderboardDetails.forEach((user, index) => {
        const row = document.createElement("tr");
        // row.innerHTML=`<tr>
        //                   <th>${index + 1}</th>
        //                   <th>${user.name}</th>
        //                   <th>${user.totalExpense}</th>
        //               </tr>`;
        const rankCell = document.createElement("td");
        rankCell.textContent = index + 1;

        const nameCell = document.createElement("td");
        nameCell.textContent = user.name;

        const costCell = document.createElement("td");
        costCell.textContent = user.totalExpense;

        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(costCell);

        leaderboardBody.appendChild(row);
      });
      
      // leaderboardButton.style.display = "none";
    } catch (error) {
      console.error("Error displaying leaderboard:", error);
    }
  });

  // Add the button to the DOM
  // document.body.appendChild(leaderboardButton);
}