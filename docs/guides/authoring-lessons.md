# Author lessons and walkthroughs

Hara Docs includes one reusable lesson component for runnable tutorials, manual
guides, and application walkthroughs. The component owns visible progress,
sequential navigation, local persistence, reset behaviour, completion feedback,
and an integration event for tools outside the page.

The browser asset is still named `syllabus.js` and `syllabus.css` so existing
MkDocs and canonical-site publication paths remain stable. The authoring API is
the `data-hara-lesson` contract described here.

## Lesson structure

A page normally contains one lesson root and two or more steps:

```html
<div class="hara-lesson"
     data-hara-lesson="package-publishing-v1"
     data-hara-lesson-title="Publish a package"
     data-hara-sequential="true">

<div class="hara-lesson-step"
     data-hara-lesson-step="prepare-project"
     data-hara-step-title="Prepare the project"
     data-hara-completion="manual">

## Prepare the project

Complete the instructions for this step.

</div>

<div class="hara-lesson-step"
     data-hara-lesson-step="verify-package"
     data-hara-step-title="Verify the package"
     data-hara-completion="manual">

## Verify the package

Complete the verification.

</div>

</div>
```

Use a versioned lesson identity such as `package-publishing-v1`. Increment the
version when steps or completion semantics change so stale browser progress is
not applied to a different lesson.

`data-hara-sequential="true"` is the default. Set it to `false` for a guide whose
steps may be completed in any order.

## Completion modes

| Mode | Completes when |
| --- | --- |
| `manual` | The learner presses **Complete step**. |
| `run` | A live Hara example returns successfully. |
| `edit-run` | Changed source returns successfully. |
| `run-edit-run` | Both the starter source and changed source return successfully. |
| `tasks` | Every authored `data-hara-task` item is checked. |
| `signal` | An external tool sends the matching lesson signal. |

Runnable steps should use a fenced Hara example. A grouped lesson can share one
session across steps:

````html
<div class="hara-lesson"
     data-hara-lesson="first-forms-v1"
     data-hara-lesson-title="First forms"
     data-hara-session-group="first-forms">

<div class="hara-lesson-step"
     data-hara-lesson-step="add-values"
     data-hara-step-title="Add values"
     data-hara-completion="run-edit-run">

```hara eval group=first-forms
(+ 19 23)
```

</div>
</div>
````

Pages with runnable lesson steps set `hara_kernel_loading: auto` in their front
matter. Resetting the lesson also emits `hara:reset-session` for the declared
group, replacing the shared live session and resetting its cards.

## Checklist walkthroughs

A task step turns any elements carrying `data-hara-task` into persistent,
keyboard-accessible check items:

```html
<div class="hara-lesson-step"
     data-hara-lesson-step="create-project"
     data-hara-step-title="Create the project"
     data-hara-completion="tasks">

## Create the project

<ul>
  <li data-hara-task="open-terminal">Open a terminal in the project directory.</li>
  <li data-hara-task="create-manifest">Create `project.edn`.</li>
  <li data-hara-task="run-check">Run `hara project check`.</li>
</ul>

</div>
```

This mode is suitable for installation guides, publishing flows, and
walkthroughs whose meaningful work happens outside the browser page.

## Application-driven walkthroughs

Use `signal` when another embedded component can verify the action:

```html
<div class="hara-lesson-step"
     data-hara-lesson-step="publish-release"
     data-hara-step-title="Publish the release"
     data-hara-completion="signal"
     data-hara-signal="release-published"
     data-hara-waiting-label="Waiting for the package portal to confirm the release.">
```

The component can then report completion through the stable public API:

```javascript
HaraLessons.signal({
  lessonId: "package-publishing-v1",
  stepId: "publish-release",
  signal: "release-published"
});
```

A tool can also complete a specific checklist item:

```javascript
HaraLessons.signal({
  lessonId: "package-publishing-v1",
  stepId: "prepare-project",
  taskId: "run-check"
});
```

The component emits bubbling `hara:lesson-progress` and `hara:lesson-reset`
events for surrounding interfaces. Progress is stored only in the current
browser under `hara-lesson:<lesson-id>`; it is not an account, assessment, or
remote tracking system.

## Authoring rules

Keep step identifiers stable within a lesson version, use concise step titles,
and state the learner-visible action before background explanation. Choose
automatic completion only when the page can observe the action reliably;
otherwise use a checklist or manual completion. A lesson must remain readable
and usable when browser storage is unavailable.
