import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { Layout, SearchBar, StatusBadge, Modal, ConfirmDialog } from '../components';
import { getMemberActiveLoans } from '../utils/libraryUtils';
import MemberForm from '../features/members/MemberForm';
import MemberDetails from '../features/members/MemberDetails';

const ITEMS_PER_PAGE = 10;

export default function Members() {
  const { members, loans, addMember, updateMember, deactivateMember } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Filter and search
  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => {
        const matchesSearch =
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.id.includes(searchTerm) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !statusFilter || member.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [members, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddMember = (memberData) => {
    const newId = `M${String(members.length + 1).padStart(3, '0')}`;
    addMember({
      id: newId,
      ...memberData,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    });
    setIsFormOpen(false);
  };

  const handleEditMember = (memberData) => {
    updateMember({
      ...selectedMember,
      ...memberData,
    });
    setIsFormOpen(false);
    setSelectedMember(null);
  };

  const handleDeactivateClick = (member) => {
    const activeLoanCount = getMemberActiveLoans(member.id, loans).length;
    if (activeLoanCount > 0) {
      alert('Cannot deactivate a member with active loans. All books must be returned first.');
      return;
    }
    setSelectedMember(member);
    setIsDeactivateDialogOpen(true);
  };

  const handleConfirmDeactivate = () => {
    if (selectedMember) {
      deactivateMember(selectedMember.id);
      setIsDeactivateDialogOpen(false);
      setSelectedMember(null);
    }
  };

  return (
    <Layout currentPage="Members">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Member Directory</h3>
            <p className="text-sm text-gray-600">
              {filteredMembers.length} of {members.length} members
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedMember(null);
              setIsFormOpen(true);
            }}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Register Member
          </button>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchBar
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Members Table */}
        {paginatedMembers.length > 0 ? (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Member ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Email</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Active Loans</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member) => {
                  const activeLoanCount = getMemberActiveLoans(member.id, loans).length;

                  return (
                    <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-medium text-gray-900">{member.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{member.name}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs">{member.email}</td>
                      <td className="px-4 py-3 text-center font-semibold">{activeLoanCount}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={member.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setIsDetailsOpen(true);
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="View details"
                          >
                            <Eye size={18} className="text-indigo-600" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setIsFormOpen(true);
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Edit"
                          >
                            <Edit2 size={18} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeactivateClick(member)}
                            disabled={member.status === 'inactive'}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Deactivate"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="btn-secondary"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-600">No members found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isFormOpen}
        title={selectedMember ? 'Edit Member' : 'Register New Member'}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedMember(null);
        }}
      >
        <MemberForm
          member={selectedMember}
          onSubmit={selectedMember ? handleEditMember : handleAddMember}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedMember(null);
          }}
          existingMembers={members}
        />
      </Modal>

      {selectedMember && (
        <Modal
          isOpen={isDetailsOpen}
          title={selectedMember.name}
          onClose={() => setIsDetailsOpen(false)}
        >
          <MemberDetails member={selectedMember} onClose={() => setIsDetailsOpen(false)} />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={isDeactivateDialogOpen}
        title="Deactivate Member"
        message={`Deactivate "${selectedMember?.name}"? They will no longer be able to borrow books, but their records will be preserved.`}
        confirmText="Deactivate"
        isDangerous={true}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => {
          setIsDeactivateDialogOpen(false);
          setSelectedMember(null);
        }}
      />
    </Layout>
  );
}
