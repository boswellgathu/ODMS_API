const DocSeed = [{
  title: "First Document",
  content: "For good content testing, you need to know who your audience is,\
            for example, literacy level, and any interests you may feel are \
            relevant in relation to the content you've written. You're not \
            really interested in whether or not the reader is going to like \
            what you've written, but more whether or not they're going to \
            actually understand what you've written.",
  access: "public",
  userId: 1,
  createdAt: Date.now(),
  updatedAt: Date.now()
}, {
  title: "Second Document",
  content: "Understanding can be greatly influenced by word choice, \
          length of sentences, grammar, and sentence structure, so \
          content testing would pay close attention to the way the \
          author is trying to express him or herself, and whether it's\
          done concisely and simply. There are some automated tools out\
          there that attempt to give you an idea as to the readability \
          of your content (for example, Readability Score), but they are \
          not as good as relying on readers to give feedback by means of \
          a test.",
  userId: 2,
  createdAt: Date.now(),
  updatedAt: Date.now()
}];

module.exports = DocSeed;
