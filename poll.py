class Poll:
    def __init__(self, question, options, id):
        self.question = question
        self.options = options
        self.votes = {option: 0 for option in options}
        self.open = True
        self.id = id

    def vote(self, option):
        if self.open and option in self.votes:
            self.votes[option] += 1
            return True
        return False

    def close_poll(self):
        self.open = False

    def to_dict(self):
        return {
            "id": self.id,
            "question": self.question,
            "options": self.options,
            "votes": self.votes,
            "open": self.open
        }
