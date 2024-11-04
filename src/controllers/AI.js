"use strict";

const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = {
  create: async (req, res) => {
    const { prompt } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const dateOfToday = new Date();

    const analyzeRequest = (prompt) => {
      const lowerPrompt = prompt.toLowerCase();

      if (lowerPrompt.includes("remind me")) {
        return "Reminder";
      }
      if (lowerPrompt.includes("send email")) {
        return "Email";
      }
      if (lowerPrompt.includes("add to do")) {
        return "toDo";
      }
    };

    const isReminderRequest = analyzeRequest(prompt);

    const extractEventDetails = async (prompt) => {
      const dateRequest = `Today is ${dateOfToday.toLocaleDateString()}. Can you provide the date of the meeting in DD-MM-YYYY format for the following sentence: "${prompt}"? Please respond with just the date.`;
      const dateResponse = await model.generateContent(dateRequest);
      const eventRequest = `Just tell what event is mentioned in the following sentence in shortest way: "${prompt}"`;
      const eventResponse = await model.generateContent(eventRequest);
      const date =
        dateResponse.response?.candidates[0].content?.parts[0].text.trim();
      const event =
        eventResponse.response?.candidates[0].content?.parts[0].text.trim();

      return {
        date: date,
        event: event,
      };
    };

    const extractEmailDetails = async (prompt) => {
      const email = await model.generateContent(
        `What is the receipent email for the following sentence: "${prompt}"? Respond with just the email.`
      );
      const recipientEmail =
        email.response?.candidates[0].content?.parts[0].text.trim();

      const subjectText = await model.generateContent(
        `Generate the shortest subject message for the following email content: ${prompt}.`
      );
      const subject =
        subjectText.response?.candidates[0].content?.parts[0].text.trim();

      const textMail = await model.generateContent(
        `Date of today=${dateOfToday}.Write a concise and professional email based on the following message: "${prompt}". Do not include any greetings or sender details. Respond with just the email body.`
      );
      const text =
        textMail?.response?.candidates[0].content?.parts[0].text.trim();

      return {
        recipientEmail,
        subject,
        text,
      };
    };

    const toDoExtract = async (prompt) => {
      const toDo = await model.generateContent(
        `Rephrase this message to make it a short and professional to-do list item: ${prompt}`
      );
      const toDoMessage =
        toDo.response?.candidates[0].content?.parts[0].text.trim();

      return {
        toDoMessage,
      };
    };

    if (isReminderRequest == "Reminder") {
      const eventDetails = await extractEventDetails(prompt);
      res.status(200).send({
        error: false,
        eventDetails,
      });
    } else if (isReminderRequest == "Email") {
      const emailDetails = await extractEmailDetails(prompt);

      res.status(200).send({
        error: false,
        emailDetails,
      });
    } else if (isReminderRequest == "toDo") {
      const toDoDetails = await toDoExtract(prompt);

      res.status(200).send({
        error: false,
        toDoDetails,
      });
    } else {
      res.status(200).send({
        error: false,
        result: result?.response?.candidates[0].content?.parts[0].text.trim(),
      });
    }
  },
};
