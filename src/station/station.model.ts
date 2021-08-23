import * as mongoose from 'mongoose';
import { Contact } from './entities/contact.model';
import { Spot } from './entities/spot.model';

export const StationSchema = new mongoose.Schema({
  callLetters: {
    type: String,
    required: true,
    unique: true,
  },
  affiliation: {
    type: String,
    required: true,
  },
  timezone: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contacts: {
    type: [
      {
        name: String,
        office: String,
        cell: String,
        role: String,
      },
    ],
    required: true,
  },
  fillList: {
    type: [
      {
        length: String,
        spots: [String],
      },
    ],
  },
});

StationSchema.pre('save', async function (next: mongoose.HookNextFunction) {
  try {
    if (!this.isModified('contacts')) {
      return next();
    }
    this['contacts'].forEach((contact) => {
      // remove all non-digit characters
      contact.cell = contact.cell.replace(/\D/g, '');
      contact.office = contact.office.replace(/\D/g, '');
      // format it to XXX-XXX-XXXX
      contact.cell = `${contact.cell.substr(0, 3)}-${contact.cell.substr(
        3,
        3,
      )}-${contact.cell.substr(6, 4)}`;
      contact.office = `${contact.office.substr(0, 3)}-${contact.office.substr(
        3,
        3,
      )}-${contact.office.substr(6, 4)}`;
    });
    return next();
  } catch (err) {
    console.error(err);
  }
});

export interface Station extends mongoose.Document {
  callLetters: string;
  affiliation: string;
  timezone: number;
  location: string;
  contacts: Array<Contact>;
  fillList: Array<Spot>;
}
