(() => {
  "use strict";

  const container = document.getElementById("leaderboards");
  const updatedLabel = document.getElementById("leaderboard-updated");
  const allowedStatuses = new Set(["published", "not-published", "unavailable"]);
  const fallbackMessage = "Rankings are temporarily unavailable. Please check back later.";

  function hasOnlyKeys(value, allowed) {
    return value && typeof value === "object" &&
      Object.keys(value).every(key => allowed.includes(key));
  }

  function showMessage(message) {
    const paragraph = document.createElement("p");
    paragraph.className = "leaderboard-empty";
    paragraph.textContent = message;
    container.replaceChildren(paragraph);
  }

  function isValidBoard(board) {
    return hasOnlyKeys(board, ["title", "period", "unit", "status", "entries"]) &&
      typeof board.title === "string" && board.title.length > 0 &&
      typeof board.period === "string" && board.period.length > 0 &&
      typeof board.unit === "string" && board.unit.length > 0 &&
      allowedStatuses.has(board.status) && Array.isArray(board.entries) &&
      board.entries.length <= 10 && board.entries.every(entry =>
        hasOnlyKeys(entry, ["character", "value"]) &&
        typeof entry.character === "string" && entry.character.length > 0 &&
        entry.character.length <= 64 &&
        Number.isSafeInteger(entry.value) && entry.value >= 0);
  }

  function renderBoard(board) {
    const section = document.createElement("section");
    section.className = "leaderboard";

    const heading = document.createElement("div");
    heading.className = "leaderboard-heading";
    const title = document.createElement("h3");
    title.textContent = board.title;
    const period = document.createElement("span");
    period.textContent = board.period;
    heading.append(title, period);
    section.append(heading);

    if (board.status !== "published" || board.entries.length === 0) {
      const empty = document.createElement("p");
      empty.className = "leaderboard-empty";
      empty.textContent = board.status === "unavailable"
        ? "This statistic is not available for public ranking yet."
        : "No results have been published yet.";
      section.append(empty);
      return section;
    }

    const list = document.createElement("ol");
    list.className = "leaderboard-list";
    board.entries.slice(0, 10).forEach(entry => {
      const row = document.createElement("li");
      const name = document.createElement("span");
      name.className = "leaderboard-name";
      name.textContent = entry.character;
      const score = document.createElement("span");
      score.className = "leaderboard-score";
      score.textContent = `${new Intl.NumberFormat().format(entry.value)} ${board.unit}`;
      row.append(name, score);
      list.append(row);
    });
    section.append(list);
    return section;
  }

  async function loadLeaderboards() {
    try {
      const response = await fetch("data/leaderboards.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Leaderboard feed returned HTTP ${response.status}.`);
      const data = await response.json();
      if (!hasOnlyKeys(data, ["schemaVersion", "updatedAt", "leaderboards"]) ||
          data.schemaVersion !== 1 ||
          (data.updatedAt !== null && typeof data.updatedAt !== "string") ||
          !Array.isArray(data.leaderboards) ||
          !data.leaderboards.every(isValidBoard)) {
        throw new Error("Leaderboard feed has an unsupported or invalid format.");
      }

      container.replaceChildren(...data.leaderboards.map(renderBoard));
      updatedLabel.textContent = data.updatedAt
        ? `Last updated ${data.updatedAt}. Rankings may show all character names and selected game stats; account and contact data are excluded.`
        : "No live game database is connected. When rankings launch, all character names and selected game stats may be public; account and contact data will not be included.";
    } catch (error) {
      console.error("Could not load public leaderboards:", error);
      showMessage(fallbackMessage);
    }
  }

  loadLeaderboards();
})();
