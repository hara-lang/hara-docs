(() => {
  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  const readProgress = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) ?? "[]");
      return new Set(Array.isArray(value) ? value : []);
    } catch (_) {
      return new Set();
    }
  };

  const writeProgress = (key, completed) => {
    try {
      localStorage.setItem(key, JSON.stringify([...completed]));
    } catch (_) {
      // Progress is optional. The course remains usable when storage is denied.
    }
  };

  ready(() => {
    document.querySelectorAll("[data-hara-syllabus]").forEach((syllabus) => {
      const id = syllabus.dataset.haraSyllabus;
      if (!id) return;
      const title = syllabus.dataset.haraSyllabusTitle ?? "Syllabus";
      const storageKey = `hara-syllabus:${id}`;
      const steps = [...syllabus.querySelectorAll("[data-hara-step]")];
      if (!steps.length) return;
      const completed = readProgress(storageKey);

      const progress = document.createElement("aside");
      progress.className = "hara-syllabus-progress";
      progress.setAttribute("aria-label", `${title} progress`);
      progress.innerHTML = `
        <div class="hara-syllabus-progress__copy">
          <span class="hara-syllabus-progress__eyebrow">${title.toUpperCase()}</span>
          <strong data-hara-progress-count></strong>
        </div>
        <button type="button" data-hara-progress-reset>Reset progress</button>
        <div class="hara-syllabus-progress__bar" aria-hidden="true"><span></span></div>`;
      syllabus.prepend(progress);

      const count = progress.querySelector("[data-hara-progress-count]");
      const bar = progress.querySelector(".hara-syllabus-progress__bar > span");

      const renderProgress = () => {
        const total = steps.length;
        const done = steps.filter((step) => completed.has(step.dataset.haraStep)).length;
        count.textContent = `${done} / ${total} complete`;
        bar.style.width = `${total ? (done / total) * 100 : 0}%`;
      };

      const attachOutputObserver = (step, button, status) => {
        const bind = () => {
          const output = step.querySelector(".hara-live-output");
          if (!output || output.dataset.haraSyllabusBound) return false;
          output.dataset.haraSyllabusBound = "true";
          const update = () => {
            const text = output.textContent.trim();
            const successful = !output.hidden
              && !output.classList.contains("is-error")
              && text.startsWith("=>")
              && !text.includes("evaluating");
            if (!successful || completed.has(step.dataset.haraStep)) return;
            step.classList.add("is-ran");
            button.disabled = false;
            status.textContent = "Ran successfully · explain the result, then complete";
          };
          new MutationObserver(update).observe(output, {
            attributes: true,
            attributeFilter: ["class", "hidden"],
            childList: true,
            characterData: true,
            subtree: true
          });
          update();
          return true;
        };
        if (bind()) return;
        const observer = new MutationObserver(() => {
          if (bind()) observer.disconnect();
        });
        observer.observe(step, { childList: true, subtree: true });
      };

      steps.forEach((step) => {
        const stepId = step.dataset.haraStep;
        if (!stepId) return;
        const footer = document.createElement("footer");
        footer.className = "hara-syllabus-step__footer";
        const status = document.createElement("span");
        status.className = "hara-syllabus-step__status";
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Complete step";
        footer.append(status, button);
        step.append(footer);

        const renderStep = () => {
          const done = completed.has(stepId);
          step.classList.toggle("is-complete", done);
          if (done) {
            step.classList.remove("is-ran");
            status.textContent = "Complete";
            button.textContent = "Mark incomplete";
            button.disabled = false;
          } else {
            status.textContent = step.classList.contains("is-ran")
              ? "Ran successfully · explain the result, then complete"
              : "Run the example before completing this step";
            button.textContent = "Complete step";
            button.disabled = !step.classList.contains("is-ran");
          }
        };

        button.addEventListener("click", () => {
          if (completed.has(stepId)) completed.delete(stepId);
          else completed.add(stepId);
          writeProgress(storageKey, completed);
          renderStep();
          renderProgress();
        });

        renderStep();
        attachOutputObserver(step, button, status);
      });

      progress.querySelector("[data-hara-progress-reset]").addEventListener("click", () => {
        completed.clear();
        writeProgress(storageKey, completed);
        steps.forEach((step) => {
          step.classList.remove("is-complete", "is-ran");
          const status = step.querySelector(".hara-syllabus-step__status");
          const button = step.querySelector(".hara-syllabus-step__footer button");
          if (status) status.textContent = "Run the example before completing this step";
          if (button) {
            button.textContent = "Complete step";
            button.disabled = true;
          }
        });
        renderProgress();
      });

      renderProgress();
    });
  });
})();
