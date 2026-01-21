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

- Why did logLater see an old value?
   - Because the the `closure` `loglater` only remebers a snapshot of the count **at that moment**
   - A closure captures values from the render that created it, not a live reference.

- Why doesn’t React “update” closures?
  - Because JS pwms closure, not react
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

- What does a dependency array actually control?
  - It controls whether we should re-run the useEffect; if any one from the dep list changes, we re-run;
  - **more precisely, The** dependency array controls when React must discard the old closure and create a new one for the effect.
  - So instead of thinking "should the effect run" , think "is this closure still valid for the current render?"

- Why does the functional updater solve many closure bugs?
  - The functional updater does not close over state. React calls it later and passes in the latest committed state.
  - That’s why it behaves like:
    - CAS
    - Atomic update
    - reducer logic

