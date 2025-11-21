npm install multer
"/api/book/:book/reference/:filename"

const formData = new FormData();
formData.append("file", file);
const response = await fetch(
    `/api/book/${this.book.id}/reference/${file.name}`,
    {
    method: "POST",
    body: formData,
    },
);
