import { Notes } from "../models/notes.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
/*
Controller required:
Creating a notes: Taking user_id, title, content, isDeleted and creating a note in database
Updating notes: User should be able to update notes title and content
Delete notes temporarily and permanently: User should be able to delete notes
*/

async function createNote(req, res) {
  try {
    console.log(req.body);
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error("Unauthorized access");
    }
    const { title, content } = req.body;
    if (title === "" || content === "") {
      throw new Error("All fields are required!!");
    }

    const note = await Notes.create({
      owner: user._id,
      title,
      content,
      isDeleted: false,
    });

    await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          notes: note._id,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { title: title, content: content },
          "Note created successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    throw new Error("Error while creating Note: ");
  }
}

async function updateNote(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error("Unauthorized access");
    }
    const { oldTitle, oldContent, newTitle, newContent } = req.body;
    if (newTitle === "" || newContent === "") {
      throw new Error("All fields are required!!");
    }

    const note = await Notes.findOne({
      $or: [{ oldTitle }, { oldContent }],
    });

    if (!note) {
      throw new Error("Could not find the old note");
    }

    note.title = newTitle;
    note.content = newContent;
    await note.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Note updated successfully"));
  } catch (error) {
    console.log(error.message);
  }
}

async function tempDeleteNote(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error("Unauthorized access");
    }
    const { title, content } = req.body;

    const note = await Notes.findOne({
      $or: [{ title }, { content }],
    });

    if (!note) {
      throw new Error("Could not find the old note");
    }

    await Notes.findByIdAndUpdate(
      note._id,
      {
        $set: {
          isDeleted: true,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Temporarily Note Deleted"));
  } catch (error) {
    console.log(error.message);
  }
}

async function permanentDeleteNote(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error("Unauthorized access");
    }
    const { title, content } = req.body;

    const note = await Notes.findOne({
      $or: [{ title }, { content }],
    });

    if (!note) {
      throw new Error("Could not find the old note");
    }

    // Without a transaction (simple case)
    await Notes.deleteOne({ _id: note._id });
    await User.findByIdAndUpdate(
      user._id,
      { $pull: { notes: note._id } },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Permanently Note Deleted"));
  } catch (error) {
    console.log(error.message);
  }
}
export { createNote, updateNote, tempDeleteNote, permanentDeleteNote };
