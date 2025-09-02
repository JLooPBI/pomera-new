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
  contactMethods: DimensionValue[];
  onNotesChange: (notes: any[]) => void;
  saving: boolean;
}

export default function NotesSection({ 
  companyId, 
  notes, 
  noteTypes, 
  contactMethods,
  onNotesChange,
  saving 
}: NotesSectionProps) {
  const [newNote, setNewNote] = useState({ 
    type: '', 
    text: '',
    followUpDate: '',
    followUpType: ''
  });

  const handleAddNote = async () => {
    if (!newNote.type || !newNote.text) {
      toast.error('Please select a type and enter a note');
      return;
    }

    // Validate follow-up date is not in the past
    if (newNote.followUpDate && new Date(newNote.followUpDate) < new Date().setHours(0, 0, 0, 0)) {
      toast.error('Follow-up date cannot be in the past');
      return;
    }

    try {
      const newNoteData = await crmDatabase.createNote({
        company_id: companyId,
        type: newNote.type,
        text: newNote.text,
        follow_up_date: newNote.followUpDate || null,
        follow_up_type: newNote.followUpType || null
      });
      
      onNotesChange([...notes, newNoteData]);
      setNewNote({ type: '', text: '', followUpDate: '', followUpType: '' });
      toast.success('Note added');
    } catch (error) {
      console.error('Note creation error:', error);
      if (error instanceof Error) {
        toast.error(`Failed to add note: ${error.message}`);
      } else {
        toast.error('Failed to add note');
      }
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
      <div className="mb-4 space-y-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Note/Activity Type</label>
          <select
            value={newNote.type}
            onChange={(e) => setNewNote({ ...newNote, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select note type</option>
            {noteTypes.map(type => (
              <option key={type.id} value={type.name}>{type.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">Comments</label>
          <textarea
            placeholder="Add a note..."
            value={newNote.text}
            onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[80px] resize-y"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Follow-Up Date</label>
            <Input
              type="date"
              value={newNote.followUpDate}
              onChange={(e) => setNewNote({ ...newNote, followUpDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Follow-Up Method</label>
            <select
              value={newNote.followUpType}
              onChange={(e) => setNewNote({ ...newNote, followUpType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select method</option>
              {contactMethods.map(method => (
                <option key={method.id} value={method.name}>{method.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <Button 
          onClick={handleAddNote} 
          size="sm"
          disabled={saving}
          className="w-full"
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-700">{note.note_type || note.type}</span>
                    {note.follow_up_date && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        Follow-up: {new Date(note.follow_up_date).toLocaleDateString()}
                        {note.follow_up_type && ` (${note.follow_up_type})`}
                      </span>
                    )}
                  </div>
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
