# adhd-ally

A Claude skill that makes explanations easier to take in for people with ADHD.

## The problem

Many people with ADHD have to say "I don't understand" many times, sometimes 7 or more, before an explanation clicks. Often Claude repeats the same explanation in different words.

## What it does

- Gives the main point first, in one or two short sentences.
- Teaches one idea per message, in short chunks and plain words.
- Uses a real example or everyday analogy before theory.
- Ends with a one-line recap and one clear next step.
- Does not ask "which part is confusing?". It guesses and tries a new angle.
- Follows a **confusion ladder**: each time you say you're lost, it changes approach instead of repeating itself. It skips any approach already used for the topic.

### The confusion ladder

| Rung | Approach |
|------|----------|
| 1 | Shorten: one sentence, plainest words |
| 2 | Everyday analogy |
| 3 | Tiny concrete example with real values |
| 4 | Step by step, one step per line, waits for "next" |
| 5 | Diagram or table |
| 6 | Backtrack to the missing prerequisite |
| 7 | You pick: analogy / example / diagram / basics |

"Huh?", "wait what", "still no", or asking the same question again also count as confusion. The ladder resets when you get it or change topic.

### Edge cases it handles

- **Partly get it:** explains only the missing part.
- **Drift off topic:** answers, then offers the way back ("We were at step 2").
- **Come back after a break:** one-line recap of where you stopped.
- **Many questions at once:** one at a time, the rest queued as "Up next".
- **"Too long" or "just tell me":** shorter reply, or the plain answer.
- **Keep forgetting:** a memory hook plus a one-line summary to save.
- **Frustrated:** short reassurance, smaller chunk, or a break.
- **Long paste or setup steps:** one line on what it is, then one part or step at a time with progress.

## How you use it

Only when you call it. Start a message with `/adhd-ally`:

```
/adhd-ally what is recursion?
/adhd-ally I still don't understand
```

There is no on or off. Each `/adhd-ally` message gets an ADHD-friendly reply. A message without it gets a normal reply, even if you say "I don't understand" or mention ADHD. If you're still lost, call `/adhd-ally` again and it moves to the next way of explaining, using the earlier replies in the chat.

## Install

### Claude Code

Installed as a plugin, adhd-ally does nothing until you type `/adhd-ally`.

```
/plugin marketplace add Khailas12/adhd-ally
/plugin install adhd-ally@adhd-ally
```

Then type `/adhd-ally` whenever you want it.

### Claude app (claude.ai or desktop)

Type `/adhd-ally` at the start of a message, the same as in Claude Code.

1. Zip the `skills/adhd-ally/` folder.
2. In Claude, go to **Customize > Skills**.
3. Click **+ > Create skill > Upload a skill**.
4. Select the zip file.

## How it works

| File | Job |
|------|-----|
| `skills/adhd-ally/SKILL.md` | The rules. Works alone in the Claude app. |
| `.claude-plugin/plugin.json` | Plugin manifest. |
| `.claude-plugin/marketplace.json` | Lets `/plugin marketplace add` find the plugin. |

The skill has `disable-model-invocation: true`, so Claude can't load it on its own. No hooks, no saved state.

## Examples

In every example below, each "You" message starts with `/adhd-ally`. It's left out to keep them short.

### 1. Explaining an API

**You:** What is an API?

**Claude:** An API is a way for one program to ask another program for something.
Like a waiter: you order, the kitchen cooks, the waiter brings it back.
Recap: API = the waiter between programs.
Next: want to see a real one?

**You:** I don't understand.

**Claude (rung 3; rungs 1 and 2 already used):** Your weather app wants today's temperature. The app asks the weather server: "temp in Paris?" The server answers: "18". That ask and answer is the API in action. Try this: name one app on your phone that needs info from somewhere else.

**You:** Hmm, I don't get it.

**Claude (rung 4):** Step 1: the app asks the server a question. Reply "next".

**You:** next... still not clicking.

**Claude (rung 5):**

```
Weather app  --- "temp in Paris?" --->  Weather server
Weather app  <--- "18"  --------------  Weather server
```

The arrows are the API. Does the picture help?

**You:** Ohh, got it.

**Claude:** Nice. In one line: an API is the set of requests a program can send, and the replies it gets back.

### 2. Explaining a loop

**You:** I can't focus, explain for loops.

**Claude:** A `for` loop repeats the same action several times.
Example: `for i in range(3): print("hi")` prints "hi" 3 times.
Recap: loop = repeat.
Try this: change 3 to 5. What happens?

**You:** I don't understand.

**Claude (rung 2; rung 1 already used):** Like brushing every tooth. Same move, one tooth at a time, until all are done. Which tooth is "one turn" of the loop?

**You:** Still no.

**Claude (rung 4; rung 3 already used):** Take `for n in [10, 20, 30]: print(n)`.
Step 1: Python takes the first value, 10. Reply "next".

**You:** next

**Claude:** Step 2: it prints 10. Reply "next".

**You:** next

**Claude:** Step 3: it goes back and takes the next value, 20. Same move again. That going back is the loop. Reply "next" for the last value.

### 3. Explaining compound interest, then backtracking

**You:** ELI5 compound interest.

**Claude:** Compound interest means you earn interest on your interest too.
Example: $100 at 10% gives $110 after year 1, then $121 after year 2.
Recap: interest on interest.
Next: want to try year 3?

**You:** I don't understand.

**Claude (rung 2; rung 1 already used):** A snowball rolling downhill. It picks up more snow, so it gets bigger faster. Your money is the snowball. Does that fit?

**You:** Still lost.

**Claude (rung 4; rung 3 already used):** Step 1: start with $100. Reply "next".

**You:** next

**Claude:** Step 2: add 10% of $100, which is $10. Total $110. Reply "next".

**You:** Wait, what is a percent?

**Claude (backtrack, user asked):** Good catch. A percent means "out of 100". 10% = 10 out of every 100. So 10% of $100 is $10. Ready to go back?

## Boundaries

- This skill only changes how explanations are written.
- It does not give medical advice and does not claim to treat or diagnose ADHD.
- For safety, medical, legal, and money topics it stays accurate and complete.
- For exact code or full documents it gives the full output, plus a short plain summary on top.

## License

MIT
