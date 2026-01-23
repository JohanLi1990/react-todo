# Day 1

1. A render happens when React schedules UI evaluation
   (mount, state change, parent render, StrictMode, retries).

2. Logging does not cause a render; it only observes that React ran render.

3. Logging inside render is misleading because render may run
   without any state change, user action, or DOM commit.

**Local variables die every render. State does not**

# Preparation

```
npm create vite@latest my-app -- --template react-ts
```

# Day 2

1. What will local log on each click?
> 1

2. What will count log on each click?
> count + 1; 

3. Will either ever increase beyond 1?
> local will stay at 1; whereas count can go beyond 1

## Takeaway
- If multiple state updates happen before the next render, setCount(count + 1) can lose updates.
- The functional form setCount(c => c + 1) won’t.
- Because count is a snapshot of react state.

# Day 3

## Predications
- if I have pressed `+` 5 times, count will be 4
- Log Later however will give me 0, because it is the snapshot it sees. 

## Practical 3
- How do you know cleanup runs? are you telling me React clears Interval?

## ✍️ End-of-Day 3 notes (must answer)

In your own words:

- **Why did logLater see an old value?**
   - Because the the `closure` `loglater` only remebers a snapshot of the count **at that moment**
   - A closure captures values from the render that created it, not a live reference.

- **Why doesn’t React “update” closures?**
  - Because JS owns closure, not react
  - JS creates closure when doing `App()`
    - Each render = a fresh function invocation
    - Each invocation creates a new closure environment
  - React 18 is concurrent; so if closure is mutatable then it will be chaos, which closure do I choose to run? which closure do I trust?
    - If closures were mutable:
      - Which render’s closure should be updated?
      - What if React abandons a render halfway?
      - What if two renders are in flight?
    - Immutable snapshots are what make:
      - concurrent rendering
      - interruption
      - retry
      - time slicing
      
      possible at all.

   “Just like Java lambda capturing effectively final variables”

   React relies on immutable closures to make concurrency safe.

- **What does a dependency array actually control?**
  - It controls whether we should re-run the useEffect; if any one from the dep list changes, we re-run;
  - **more precisely, The** dependency array controls when React must discard the old closure and create a new one for the effect.
  - So instead of thinking "should the effect run" , think "is this closure still valid for the current render?"

- **Why does the functional updater solve many closure bugs?**
  - The functional updater does not close over state. React calls it later and passes in the latest committed state.
  - That’s why it behaves like:
    - CAS
    - Atomic update
    - reducer logic

# Day 4

## ✍️ End-of-Day 4 questions (answer in your own words)

- **When does useEffect run relative to render**?
  - useEffect runs after every render
  - **more precisely** useEffect runs after React commits the render to the DOM, not merely after the render function is called.
  - React may call render and discard it
  - Effects only run for committed renders

- **When does cleanup run?**
  - Cleanup runs before the **next effect** is executed, or when the component unmounts.
  - A render can happen without an effect re-running
  - Cleanup is tied to effect re-execution, not render itself

- **What does the dependency array actually mean?**
  - Dependency array controls, when we should discuss the old closure, and create a new one

- **Why does StrictMode run effects twice in dev?**
  - In dev mode, react will try to check if the effect run can be successfully cleaned; that is why it run twice to observe the cleanup.

- **Why must effects be idempotent?**
  - if it is not, the previous closure will have impacts on the current closure
  - then result becomes unpredictable
  - in React 18 we have concurrency; if multiple effect runs simultaneously, there will be race conditions.
  - From ChatGPT words: Effects must be idempotent because React may:
    - run them more than once (*ticks* example)
    - interrupt them
    - clean them up and restart them
    - retry renders in concurrent mode
  - If an effect assumes “run exactly once”, it’s broken by design.

## Takeaway / my own conceptual question

### 1️⃣ **What does “React commits changes to the DOM” actually mean?**

  > “Commit” has nothing to do with compiling TypeScript or generating HTML strings.
  It is a runtime phase where React mutates the browser DOM to match a computed UI tree.

  - Step 0 — **TypeScript / JSX (build time, not runtime)**
    First, **my code**
    ```js
      function App() {
        return <div>Hello</div>;
      }
    ```
    Then, is compiled (by Vite / Babel / TS) into somethin like:
    ```js
    function App() {
      return React.createElement("div", null, "Hello");
    }
    ```
    That’s it.

    ❌ No HTML generation

    ❌ No DOM touching

    ✅ Just JavaScript functions

    This is build-time, not what we mean by “commit”.

  - Step 1 - **Render phase** (pur computation, no DOM)
    - At runtime, React does this:
    ```
      call App()
      → returns a tree of React elements (plain JS objects)
    ```
    
    Example (conceptually)
    ```
    {
      type: "div",
      props: { children: "Hello" }
    }

    ```
    - **Important properties of the render phase:**
      - ✅ Pure computation
      - ✅ No DOM access
      - ✅ No side effects
      - ❌ Nothing visible changes yet
      - ❌ Browser is not touched
    - This is where:
      - React may run your component multiple times
      - React may abandon work
      - React may retry
      - React may pause (React 18)
    - This phase is interruptible.
  
  - Step 2 — **Reconciliation** (still no DOM)
    - React now compares:
    ```
      previous UI tree
      vs
      new UI tree
    ```

    - it calculates:
      - What node changed
      - what stayed the same
      - what must be inserted /updated/removed
    - This produces a **mutation plan**, no DOM changes yet
    
    Still

    ❌ No DOM mutation
    
    ❌ No layout
    
    ❌ No paint
     
  - Step 3 — **Commit phase (THIS is the key)**
    - Now react enters the commit phase
    - THis is when Reacrt actually:
      - calls `document.createElement`
      - Sets attribute
      - updates text nodes
      - Attaches event listeners
      - Remove nodes
      - Runs `useLayoutEffect`
      - Then schedules `useEffect`
    - **This is the moment the browser DOM is mutated**
  - Key properties 
    - ✅ DOM mutations happen
    - ✅ Effects are scheduled
    - ❌ Cannot be interrupted
    - ❌ Must be fast
    - ❌ Must be consistent
  - This is why Reacts separates
    - render (pure, retryable)
    - commit (imperative, one-shot)
  
  When I said:

    > “useEffect runs after React commits the render”

  I meant:

    > After the DOM actually reflects the new UI

    > After the browser has something concrete to show

    > After React knows this render “won”

  This is conceptually similar to

  > database transaction planning

  > write-ahead log

  > then commit changes

  Hence the word commit.

### 2️⃣ JavaScript, threads, and “concurrency” in React 18

- **Is Javacsript single-threaded**
  
  **Yes, mostly**
  ```
  JavaScript execution (your JS code) runs on one main thread.
  No shared-memory multithreading
  No data races like Java threads
  No locks / volatile / CAS in user JS
  ```

- **Does Javascript have a GIL like Python?**
  
  **No, and this is important**

  Python’s GIL exists because:
  - Multiple OS threads execute Python bytecode
  - The GIL serializes them

  JavaScript is different:
  - There is only one execution thread
  - No need for a GIL
  - The event loop controls scheduling

  So JS ≠ Python threading model.

- **Then what does concurrency mean in React 18?**
  
  React 18 concurrency = cooperative scheduling
  ```
    React render work
    → pause
    → browser handles input / paint
    → resume render
  ```
  This is not multithreading

  It is closer to:
  cooperative multitasking, co-routines, fibers (literally)

- **Why closure must be immutable (connecting back to Day 3)**
  
  Because React can:
  ```
  Start rendering version A
  Pause it
  Start rendering version B
  Discard A
  Commit B
  ```

  If closures were mutable:

  Which render’s closure do you mutate?

  What if render A resumes after B commits?

  **Total chaos**

  So React’s concurrency model depends on immutable snapshots.

  | Java              | React 18            |
  | ----------------- | ------------------- |
  | Threads           | Tasks               |
  | Preemptive        | Cooperative         |
  | Locks             | Immutable snapshots |
  | CAS               | Functional updates  |
  | Memory visibility | Closure snapshots   |

# Day 5

## ✍️ End-of-Day 5 questions (answer these)

- **Why do children re-render when parents render**?
  
  Children re-render when parents render because React evaluates the component tree top-down, and invoking a parent component requires invoking its children to compute the UI. Props are only used to skip re-renders when memoization (`React.memo`) is explicitly enabled.
  

- **Why does a new function cause re-render even if logic is identical**?
  
  Because a new function is a new identity; just like if I do `new Foo()` in Java; the logic in `Foo` never changes, but there is a new instance created in heap;

- **What problem do useCallback and useMemo actually solve?**
  
  `useCallback` / `useMemo` preserve reference identity across renders so that downstream consumers see the same object/function instead of a new one;
  They **cache the value**, **return the smae refernce** across renders, **until DEPENDENCIES change**; nothing is wrapped, nothing is proxied, nothing is intercepted. 
  
- **When should you not use them?**
  
  You should NOT use them when:
  - e-render cost is trivial
  - Identity stability is not observed by anyone
  - You want fresh objects to signal changes
  - Memoization adds complexity without benefit
  - A key idea:
  
  Re-rendering is not a bug. Unnecessary re-rendering is.

## Summary

By default, when a parent component renders, all its children are re-rendered,
regardless of whether props changed.

A child only skips re-rendering when React.memo is used AND all props have the
same reference identity.

New functions and objects cause re-renders because React compares props using
reference equality (===), not behavior or deep equality.

useCallback and useMemo preserve reference identity across renders by caching
values until dependencies change; they do not wrap or proxy values.

They should only be used when reference stability is observed by memoized
children or dependency arrays; otherwise they add unnecessary complexity.

Memoization is like caching:
- Caching has a lookup cost
- Caching adds invalidation complexity
- Caching is only worth it when it avoids something more expensive than itself
