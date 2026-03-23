export const bookData = {
    validBook: {
        title: "Playwright Automation",
        author: "Aravind QA",
        genre: "Science Fiction",
        year: "2024",
        pages: "250",
        isbn: "1234567890",
        rating: "4",
        description: "Automation testing book"
    },

    invalidBook: {
        title: "",
        author: "",
    },

    publishedYear: {
        min: [
            'value must be greater than or equal to 1000',
            'Please select a value that is no less than 1000.',
            'range underflow'
        ]
    },

    rating: {
        min: [
            'Value must be less than or equal to 5.',
            'Please select a value that is no more than 5.',
            'range underflow',
            'range overflow'
        ]
    },

    required: {
        fillOutThisField: "fill out this field"
    }

};