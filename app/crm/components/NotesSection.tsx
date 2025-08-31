"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { crmDatabase, type DimensionValue } from '@/lib/supabase-crm';
import { toast } from 'react-hot-toast';

interface NotesSectionProps {
  companyId: string;
  notes: any[];
  noteTypes: DimensionValue[];
  onNotesChange: (notes: any[]) => void;
  saving: boolean;
}

export default function NotesSection({ 
  companyId, 
  notes, 
  noteTypes, 
  onNotesChange,
  saving 
}: NotesSectionProps) {
  const [newNote, setNewNote] = useState({ 
    type: '', 
    text: '' 
  });

  const handleAddNote = async () => {
    if (!newNote.type || !newNote.text) {
      toast.error('Please select a type and enter a note');
      return;
    }

    try {
      const result = await crmDatabase.createNote({
        company_id: companyId,
        note_type: newNote.type,
        note_text: newNote.text
      });
      
      if (result.data) {
        onNotesChange([...notes, result.data]);
        setNewNote({ type: '', text: '' });
        toast.success('Note added');
      } else {
        toast.error('Failed to add note');
      }
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const handleDeleteNote = async (note: any, index: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        if (note.note_id) {
          await crmDatabase.deleteNote(note.note_id);
        }
        onNotesChange(notes.filter((_, i) => i !== index));
        toast.success('Note deleted');
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Notes & Activities</h3>
      <div className="mb-4 flex gap-2">
        <select
          value={newNote.type}
          onChange={(e) => setNewNote({ ...newNote, type: e.target.value })}
          className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select note type</option>
          {noteTypes.map(type => (
            <option key={type.id} value={type.name}>{type.name}</option>
          ))}
        </select>
        <Input
          placeholder="Add a note..."
          value={newNote.text}
          onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
          className="flex-1"
        />
        <Button 
          onClick={handleAddNote} 
          size="sm"
          disabled={saving}
        >
          {saving ? 'Adding...' : 'Add Note'}
        </Button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-sm text-gray-500">No notes yet</p>
        ) : (
          notes.map((note, index) => (
            <div key={note.note_id || index} className="border rounded p-3 bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">{note.note_type || note.type}</span>
                  <p className="text-sm mt-1">{note.note_text || note.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(note.created_date || note.date).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteNote(note, index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
