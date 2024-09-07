# 🌍 Trip Secretary
### ✈️ Your Ultimate Trip Organizer

Trip Secretary is a trip-planning app that helps you organize your travels down to the hour, track expenses, and manage your itinerary visually — built using React, Next.js, Pragmatic Drag-n-Drop, and many other [cool technologies](#️-technologies-used).

### Try it here: [🔗 Trip Secretary](https://trip-secretary.vercel.app/)

### 🔥 Motivation
Traveling is exhilarating, but staying organized can be challenging. That's why I created **Trip Secretary** — a tool designed to help you squeeze every moment out of your travels.

I realized that traditional calendars just don't cut it when it comes to planning the perfect trip. I like to maximize my time (like exploring all of Prague in just two days!), and for that, I need to plan each minute meticulously. That's where **Trip Secretary** comes in.

With this app, I can clearly visualize everything I want to do, hour by hour, in a beautifully organized way. Plus, I can keep track of the costs associated with each activity, giving me a clear forecast of my expenses.

I’ve already tested this during my recent trip to Europe, and it was a game-changer! I believe it can add value to other travelers too.

# 🚧 Current Status: **Under development**

## 🎯 Key Features:

### ✅ Completed
* [x] Deploy into Vercel
* [x] Automatic testing through GitHub actions
* [x] Compromise creation through clicking
* [x] Use pragmatic drag-n-drop to manage compromises dragging and resizing
* [x] Use jotai to manage state
* [x] Change compromises for different dates
* [x] Store compromises at appwrite
* [x] Oauth2 login through appwrite
* [x] Store in IndexedDB when not logged in
* [x] Mobile-friendly data drawer to add compromises
* [x] Delete compromises

### 📝 To Do
* [ ] Login/Logout through dropdown menu
* [ ] Edit compromises
* [ ] See the whole compromise description
* [ ] Make the resize clearer by adding an arrow to indicate the resizable area
* [ ] Use react query to change dates (using cancellation token in case of rapid multiple changes)
* [ ] Date on the route
* [ ] SSR initial data fetching (if the user is logged in)
* [ ] Improve the date picker visuals (maybe use shadcn Datepicker?)
* [ ] Add loading feedback
* [ ] Add creating an item feedback
* [ ] Improve CSS animations
* [ ] Exhibit total amount of costs per day
* [ ] Get user's photo from Google Oauth2?
* [ ] Create a DockerFile
* [ ] Create a MakeFile
* [ ] Add a retry routine for appwrite
* [ ] Restrict user on appwrite to edit only his own registers
* [ ] Add a delete confirmation option
* [ ] Add an erase my data option

## 🚀 How to Run it?

To run **Trip Secretary**, you’ll need the following:

- A working installation of **[Node.js](https://nodejs.org/)**.


Then, you can run the following commands on your terminal:

```bash
# Install Dependencies:
npm install 

# Start the Development Server:
npm run dev

# The application will be available at http://localhost:3000.

# Run Tests:
npm run test
```

## 🛠️ Technologies Used

<table style="width:100%">
  <tr>
    <th>Category</th>
    <th>Technology</th>
  </tr>
  <tr>
    <td>🖱️ User Interactions</td>
    <td><a href="https://github.com/atlassian/pragmatic-drag-and-drop">Pragmatic Drag-n-Drop</a></td>
  </tr>
  <tr>
    <td>🌐 JavaScript Library</td>
    <td><a href="https://react.dev/">React</a></td>
  </tr>
  <tr>
    <td>🌐 Web Framework</td>
    <td><a href="https://nextjs.org/">Next.js</a></td>
  </tr>
  <tr>
    <td>📦 Programming Language</td>
    <td><a href="https://www.typescriptlang.org/">TypeScript</a></td>
  </tr>
  <tr>
    <td>⚙️ State Management</td>
    <td><a href="https://jotai.org/">Jotai</a></td>
  </tr>
  <tr>
    <td>🎨 Styling</td>
    <td><a href="https://tailwindcss.com/">Tailwind CSS</a>, <a href="https://ui.shadcn.com/">Shadcn</a></td>
  </tr>
  <tr>
    <td>🖼️ Animations</td>
    <td><a href="https://auto-animate.formkit.com/">Auto Animate</a></td>
  </tr>
  <tr>
    <td>🚀 Deployment</td>
    <td><a href="https://vercel.com/">Vercel</a></td>
  </tr>
  <tr>
    <td>📂 Data Storage</td>
    <td><a href="https://www.w3.org/TR/IndexedDB/">IndexedDB</a>, <a href="https://appwrite.io/">Appwrite</a></td>
  </tr>
  <tr>
    <td>💻 Testing</td>
    <td><a href="https://jestjs.io/">Jest</a>, <a href="https://github.com/features/actions">GitHub Actions</a></td>
  </tr>
  <tr>
    <td>🔧 Code Formatting</td>
    <td><a href="https://prettier.io/">Prettier</a></td>
  </tr>
</table>
