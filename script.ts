type Dish = {
    dish: string;
    ingredients: string[];
};

const dishes: Dish[] = [
    { dish: "Toast 🍞", ingredients: ["🍞", "🧈"] },
    { dish: "Salad 🥗", ingredients: ["🥬", "🥕", "🥒"] },
    { dish: "Hot Dog 🌭", ingredients: ["🌭", "🍞", "🧅"] },
    { dish: "Pizza 🍕", ingredients: ["🍞", "🍅", "🧀"] },
    { dish: "Pasta 🍝", ingredients: ["🍝", "🍅", "🧀", "🌿"] },
    { dish: "Burger 🍔", ingredients: ["🥩", "🍞", "🧀", "🍅", "🥬"] },
    { dish: "Taco 🌮", ingredients: ["🌮", "🥩", "🧀", "🥬", "🍅"] },
    { dish: "Sushi 🍣", ingredients: ["🍚", "🐟", "🥢", "🥑", "🍋"] },
    { dish: "Ramen 🍜", ingredients: ["🍜", "🥩", "🥚", "🌿", "🧄", "🧅"] },
    { dish: "Feast 🍽️", ingredients: ["🍗", "🍖", "🍞", "🍷", "🥗", "🧁", "🍇"] },
];

let currentDish: Dish | null = null;
let score = 0;
let timer = 60;

const orderDisplay = document.getElementById("order-display")!;
const prepArea = document.getElementById("prep-area")!;
const ingredientTray = document.getElementById("ingredient-tray")!;
const scoreDisplay = document.getElementById("score")!;
const timerDisplay = document.getElementById("timer")!;
const submitBtn = document.getElementById("submit-btn")!;
const saveBtn = document.getElementById("save-btn")!;
const loadBtn = document.getElementById("load-btn")!;

function generateRandomOrder() {
    currentDish = dishes[Math.floor(Math.random() * dishes.length)];
    orderDisplay.textContent = `${currentDish.dish}`;
    prepArea.innerHTML = "";
}

function generateIngredients() {
    // @ts-ignore
    const allIngredients = dishes.flatMap((dish) => dish.ingredients);
    const shuffled = [...new Set(allIngredients)].sort(() => Math.random() - 0.5);

    ingredientTray.innerHTML = "";
    shuffled.forEach((ingredient) => {
        const ingredientElement = document.createElement("span");
        // @ts-ignore
        ingredientElement.textContent = ingredient;
        ingredientElement.className = "ingredient badge bg-secondary";
        // @ts-ignore
        ingredientElement.onclick = () => addIngredientToPrep(ingredient);
        ingredientTray.appendChild(ingredientElement);
    });
}

function addIngredientToPrep(ingredient: string) {
    const ingredientElement = document.createElement("span");
    ingredientElement.textContent = ingredient;
    ingredientElement.className = "badge bg-success me-1";
    prepArea.appendChild(ingredientElement);
}

function checkOrder() {
    if (!currentDish) return;

    const prepared = Array.from(prepArea.children).map((el) => el.textContent);
    // @ts-ignore
    if (currentDish.ingredients.every((ing) => prepared.includes(ing))) {
        score += 10;
        scoreDisplay.textContent = `${score}`;
        generateRandomOrder();
        generateIngredients();
    } else {
        alert("Incorrect! Try again.");
    }
}

function startGame() {
    generateRandomOrder();
    generateIngredients();

    const interval = setInterval(() => {
        timer--;
        timerDisplay.textContent = `${timer}`;
        if (timer <= 0) {
            clearInterval(interval);
            alert(`Game over! Your score is ${score}`);
        }
    }, 1000);
}

function saveGame() {
    const gameState = {
        currentDish,
        score,
        timer,
    };
    localStorage.setItem("emojiChefGame", JSON.stringify(gameState));
    alert("Game saved!");
}

function loadGame() {
    const savedState = localStorage.getItem("emojiChefGame");
    if (savedState) {
        const { currentDish: savedDish, score: savedScore, timer: savedTimer } = JSON.parse(savedState);
        currentDish = savedDish;
        score = savedScore;
        timer = savedTimer;

        scoreDisplay.textContent = `${score}`;
        timerDisplay.textContent = `${timer}`;
        orderDisplay.textContent = `${currentDish?.dish}`;
        generateIngredients();

        alert("Game loaded!");
    } else {
        alert("No saved game found.");
    }
}

submitBtn.addEventListener("click", checkOrder);
saveBtn.addEventListener("click", saveGame);
loadBtn.addEventListener("click", loadGame);

document.body.onload = startGame;
