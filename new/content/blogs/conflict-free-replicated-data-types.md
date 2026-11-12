---
title: "Conflict Free Replicated Data Types (CRDTs)"
gif: "computer.gif"
date: "2025-08-25"
tags: ["knowledge share"]
excerpt: "A wild and conceptual article about data conflict resolution"
---

# Contextualise

- This is a long term, what is the thing that it is trying to solve?
- A lot of apps these days allow for multiple users to work on the same thing at the same time, collaborative tools like
  - Google docs
  - Figma
  - Excalidraw
- For each of these tools, what the user is viewing to them is the source of truth
  - What happens if your action impacts what another user is doing (and vice versa)?
    - It becomes very easy for one user's data to diverge from another
- We need to be able to sync changes between user systems in a deterministic way such that everyone's changes line up without the intervention of a server

# Introducing CRDTs

- To handle the resolution of changes for multiple users, we use implementations of Conflict-Free Replicated Data Types (CRDTs)
- Unlike database replication, CRDTs allows for user's systems to diverge given the guarantee that everyone's system will eventually align.
  - This approach of replication is called 'Optimistic replication', and the goal of alignment is called 'Eventual consistency'
- This also means that user's systems may update at different rates to their peers, eventual consistency is achieved when all of the user's have completed all pending updates
- Updates may occur in different orders for different users too, for example your change might be made after another's, but you might already be behind another user's changes
- The important point is that users can independently update their own information without needing to coordinate with other users
- I'll use the terms: users, peers, and replicas. For all intents and purposes, these are the same things when talking about CRDTs

# The Approaches

- There are two types of CRDTs, state-based and operation-based

# State-Based (CvRDTs)

- Also known as as Convergent Replicated Data Types (CvRDTs)
- This approach defines two types:
  - A local state
  - A record of all actions occurring on the state
- It also defines three functions
  - Something to create the initial state
  - A function to merge states
    - The merge function is particularly important because it must be
      - Commutative - Ordering of items shouldn't matter `merge(a, b) == merge(b, a)`
      - Associative - Grouping of items shouldn't matter `merge(a, merge(b, c)) == merge(merge(a, b), c)`
      - Idempotent - Applying the exact same state update multiple times shouldn't result in any changes outside the original `merge(a, a) == a`
  - A function to update the state
- How it works is:
  - Send full state to other users (replicas) on update
  - Upon receiving state, merge it with the local state
    - Merging means to join the states in a way that the outcome is the smallest relevant data required to represent the sets
      - This can be represented as a semilattice
  - Update the state with the merged data (semilattice)
    - Updates are one way only, you can only gain information, you can't forget information (i.e., function must be monotone)
    - States only grow, they never shrink
    - Being monotonic helps ensure our state is idempotent and that we are leading to eventual consistency
- There is also another implementation of CvRDTs called 'Delta state CRDTs', which only send the recent changes, rather than the entire state
  - e.g., the operations `add(1)` and `add(1)` can be compressed to `add(2)`

# Operation-based (CmRDTs)

- Also known as Commutative Replicated Data Types (cmRDTs)
- These CRDTs do not have a merge function!
- Instead of telling other users about the new state, you tell them about the updates that need to be made
  - The update functions still need to be commutative and associative
  - The update function doesn't need to be idempotent, we just expect that the update function isn't sent multiple times
  - The updates sent out also need to be sent out in the order that the state was changed (you can't send out an later change before an earlier change)
- It's also possible to delay the sharing of operations, allowing the operations to be compressed (though this may depend on how up to date the state may need to be)

# CvRDT vs CmRDT

- Both approaches have the same goal of eventual consistency, so the outcome should look the same, but there are some considerations for one approach over another:

|                    | CvRDT                                                                                      | CmRDT                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Implementation     | Simple                                                                                     | Complex                                                                                  |
| Required bandwidth | Shares entire state (but can be made more efficient by implementing as a Delta CRDT)       | Tells others how to update state                                                         |
| Guarantees         | Each user knows how to merge state in a communicative, associative, and idempotent fashion | Each user is responsible for sending the right information, not duplicating instructions |

# Just to reset

- CRDTs have an initial set, this user pulls in another peer's state data or update function, and merges it with its own state
  - There are principles that this merge needs to adhere to in order to be considered a CRDT (commutative, associative, idempotent)
  - The way the merge function works is up to the implementation to decide (which we will get into)
- Whilst I gave an example that CRDTs solve problems faced by collaborative tools, this isn't really true as in its purest form CRDTs solve problems for decentralised peer to peer networking, where nodes tell others about their updates without an intermediary server.
  - The updates then spread across the entire network of peers in an approach known as 'gossip protocol'.
- A lot of mathematical set theory exists to ensure a deterministic outcome between peers for eventual consistency

# A basic CRDT interface

- For a simple and practical example of CmRDT consider the following counter interface:

```typescript
interface Counter {
  value: number
  increment: () => void
  decrement: () => void
}
```

- If PeerA and PeerB start at `value: 5`. Locally the following actions are done:
  - PeerA: `increment`, `increment`, `decrement` - resulting value is `6`
  - PeerB: `decrement`, `decrement` - resulting value is `3`
- Then both peers receive the update functions made by the other peer
  - PeerA: `decrement`, `decrement` - resulting value is `4`
  - PeerB: `increment`, `increment`, `decrement` - resulting value is `4`
- Both peers converge to the same value
- This is a simplified model though, there are a couple of standards that operation-based CRDTs typically implement, such as a 'generator' function that creates an 'operation' that will be sent to other peers to be consumed
  - This operation will then be consumed by an 'effector' function to update one's own state

- If however we consider a simple CvRDT interface

```typescript
interface CRDT<T, S> {
  value: T
  state: S
  merge(state: S): void
}
```

- Where
  - `value` is the actual contents of the program that the user is directly interacting with
  - `state` is a representation of `value` that is digestible and serializable for other users, it may also contain metadata
  - `merge` the function that takes some other state and merges it with the owned state
- Suppose the `value` is a string, initially it is `"hello"` in PeerA and PeerB, what happens when PeerA updates it to `"hello, world"` but PeerB updates it to `"goodbye"`, how do you merge that?

# Common CRDT approaches

- Concurrency is a big concern with CRDTs, because if we receive two actions at the same time that conflict with one another (or with out own state), then which one should be favoured?
- In the case of simple CRDTs such as the counter example, it doesn't matter because those actions can resolve without conflict
- For cases which are more complex like the example with strings provided before, we need to get into the weeds a bit more and build resolution approaches that factor in time.
  - Remove-Wins
    - If an operation occurs at the same timestamp, then the remove action wins
    - Used with sets
    - Remember though, CRDTs must be monotonic, they have to keep the same level of information or gain information, you cannot lose information. This means that we usually reset the 'removed value' and set it as a "tombstone".
  - Add-Wins
    - If an operation occurs at the same timestamp, then the add action wins
    - Used with sets
  - Observed Remove
    - If you are told to remove something that you know about, then you remove it. Otherwise the information isn't relevant
    - Used with sets
  - Last Write Wins
    - Probably the simplest approach that doesn't relate to sets. If an operation is received which was made after yours, then you take that as the source of truth. Otherwise disregard.
    - If the times are the same, then the implementation would need to dictate whether removal or adding wins
  - First Writer Wins
    - Opposite of Last Write Wins
- For most cases happens-before will be the main factor
  - If an update event happens before another update event then the one that happened first should be given the priority, this means a lot of the above approaches are generally unused
  - This can also be resolved via 'casual ordering', if A happens before B, then we expect A to have happened before B

# (Aside) Clocks

- Timestamps are a surprisingly tricky to deal with when it comes to distributed systems
  - Localised time isn't appropriate as you want all replicas to have a standardised format
  - System time for each of the replicas isn't appropriate as there may be very slight inconsistencies between the system time for each replica
- What you may want is a 'Totally Ordered Clock', what this means is there is a single source of truth that all distributed systems use for their time source
  - However due to how precise this is, it may obscure some concurrency that could be experienced using other approaches
- From what I can see, 'Vector clocks' are the common approach in distributed systems because information updates can be distributed easier from system to system based by relying more on casual ordering
- I won't be taking questions about clocks...
  - I didn't have the time to look into it, there is a whole world out there...

# More Complex CRDT approaches (like text editing)

- As mentioned with the previous CRDT approaches, these are quite simple add and delete operations with very rigid and organised data
- It gets a bit confusing and complex as the resolution approaches differ quite a bit based on the data model that you are using.
  - CRDTs have a heavy foundation in set theory, which can be difficult to translate to more fluid types like strings
- For example, how do you ensure that changes to a string is commutative? (ordering of changes does matter when interacting with strings!)
- This introduces the concept of Sequence CRDTs
  - Used for more complex cases like text/document editing which is more free form
  - This is still a pretty new field though, it requires a bit more research and it's likely it'll become the norm moving forward
- An alternative to this is another concept called Operational Transform which is a bit older but has its roots in things like Google Docs.
  - But ordering of operations is very important, it is not commutative. Which means that it relies on a server running and/or consensus algorithm to consume changes and ensure that they are ordered before acted upon

# Example Last Write Wins code (CvRDT)

```typescript
class LWWRegister<T> {
  readonly id: string
  state: [peer: string, timestamp: number, value: T]

  get value() {
    return this.state[2]
  }

  constructor(id: string, state: [string, number, T]) {
    this.id = id
    this.state = state
  }

  set(value: T) {
    // set the peer ID to the local ID, increment the local timestamp by 1 and set the value
    this.state = [this.id, this.state[1] + 1, value]
  }

  merge(state: [peer: string, timestamp: number, value: T]) {
    const [remotePeer, remoteTimestamp] = state
    const [localPeer, localTimestamp] = this.state

    // if the local timestamp is greater than the remote timestamp, discard the incoming value
    if (localTimestamp > remoteTimestamp) return

    // if the timestamps are the same but the local peer ID is greater than the remote peer ID, discard the incoming value
    if (localTimestamp === remoteTimestamp && localPeer > remotePeer) return

    // otherwise, overwrite the local state with the remote state
    this.state = state
  }
}
```

> Sourced from https://jakelazaroff.com/words/an-interactive-intro-to-crdts

- This only houses one piece of data, but the way that CRDTs scale is that you fundamentally just join simple CRDTs into mode complex ones. In this case we have one state, if we added a map then that allows us to have a multitude of states but the concept stays pretty much the same.

# Why use CRDTs

- They allow for availability when facing communication/network disruptions, the replica can act independent from its peers if need be
- Changes can be applied asynchronously, which gives the illusion of low latency
- CRDTs are built with guarantees/assurances that eventual consistency will be achieved
  - And it is able to do this without an enforcing server

# Limitations of CRDTs

- They need to store a lot of metadata, typically about their own state and about its peers, whilst also generating an amount of metadata in the operation / state to be sent to other replicas
- It is difficult to undo actions (such as a system failing or an incorrect message or operation being sent). Doing so requires almost double the amount of implementation because you now need to support the negation of an operation
- There are potential security concerns as the action of one replica affects all other replicas. If you also want to encrypt the shared state/operations, this reduces the bandwidth and performance of merging and updating due to the additional encryption and decryption steps required (this is a particular issue for CvRDTs who share states).
- CRDTs are quite a new concept (originally devised in [2011](https://pages.lip6.fr/Marc.Shapiro/papers/RR-7687.pdf)), so there is still ongoing work to devise the best approaches for ensuring system correctness, at the moment the onus is on the implementors

# Conclusion

- CRDTs are "eventually consistent systems [that] allows us to sacrifice consistency for availability without having the state of different machines diverge irreparably."
  - From https://www.scattered-thoughts.net/writing/causal-ordering/
- Though they were originally designed to work with decentralised peer to peer networks like databases, there are already tools that are making CRDTs more accessible to everyday developers, and I'm sure there will be more to come as the field of Sequence CRDTs advances.

# Glossary

- Eventual Consistency - All nodes in a distributed system are guaranteed to align given enough time
- Commutative - Ordering of items shouldn't matter
- Associative - Grouping of items shouldn't matter
- Idempotent - Applying the exact same state update multiple times shouldn't result in any changes outside the original
- Lattice - A partially ordered set
- Semilattice - A partially ordered set that is combination/join of two or more sets, which contains the minimum necessary information (based on the join function) of the joint sets.
- Monotone Semilattices - States can only persist or grow with information, never decrease or lose information
- CvRDTs - Convergent Replicated Data Types
- CmRDTs - Commutative Replicated Data Types
- Gossip Protocol - The communication from peers to peers to ensure that data is eventually shared to all peers in a network. Also known as Epidemic Protocol due to the metaphorical nature of how information is spread across the network.
- Generator - A function created in an operation-based CRDT that is sent to other peers to tell them how to update their state
- Effector - A function in operation-based CRDTs that consumes and applies incoming operations
- Casual Ordering - If A happens before B, then we expect A to have happened before B (at a high level)
- Monotonic - Updates are one way only, you can only gain information, you can't forget information
- Tombstone - Used to indicate that a value has been 'removed'

# Bibliography

- https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type
- https://en.wikipedia.org/wiki/Optimistic_replication
- Chat-gpt
- https://en.wikipedia.org/wiki/Gossip_protocol
- https://jakelazaroff.com/words/an-interactive-intro-to-crdts
- https://crdt.tech/
- https://arxiv.org/pdf/1805.06358
- https://www.scattered-thoughts.net/writing/causal-ordering/
- https://pages.lip6.fr/Marc.Shapiro/papers/RR-7687.pdf
- https://www.cs.princeton.edu/courses/archive/fall22/cos418/docs/L6-vc.pdf
- https://en.wikipedia.org/wiki/Vector_clock
- https://www.youtube.com/watch?v=gZP2VUmH05A
- https://www.youtube.com/watch?v=xR7-H1EMDJc
- https://medium.com/coinmonks/operational-transformations-as-an-algorithm-for-automatic-conflict-resolution-3bf8920ea447
- https://www.youtube.com/watch?v=uOKrTc3Q0D0
- https://redis.io/blog/diving-into-crdts/
