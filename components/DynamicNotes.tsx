"use client"

import { useState } from 'react';
import { Plus, MessageSquare, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Note {
  id: string;
  content: string;
  created_date: string;
  created_by: string;
}

interface DynamicNotesProps {
  notes?: Note[];
  onAddNote?: (content: string) => void;
}

export default function DynamicNotes({ notes = [], onAddNote }: DynamicNotesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote?.(newNote.trim());
      setNewNote('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Notes & Communications</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      {/* Add New Note Form */}
      {isAdding && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={handleAddNote}>
              Save Note
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsAdding(false);
                setNewNote('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Existing Notes */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No notes yet. Add your first note to get started.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>{note.created_by}</span>
                  <Calendar className="h-4 w-4 ml-2" />
                  <span>{new Date(note.created_date).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}