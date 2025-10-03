import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import tw from 'twrnc';
import { AdminTicket } from '../types';

export const SupportManagementScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');

  const tickets: AdminTicket[] = [];

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-600',
      in_progress: 'bg-orange-100 text-orange-600',
      resolved: 'bg-green-100 text-green-600',
      closed: 'bg-gray-100 text-gray-600',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-500';
  };

  const statusFilters = [
    { label: 'All Tickets', value: 'all', count: 247 },
    { label: 'Open', value: 'open', count: 89 },
    { label: 'In Progress', value: 'in_progress', count: 56 },
    { label: 'Resolved', value: 'resolved', count: 78 },
    { label: 'Closed', value: 'closed', count: 24 },
  ];

  const quickActions = [
    { label: 'Assign to Me', icon: '◎', color: 'bg-blue-500' },
    { label: 'Mark In Progress', icon: '◐', color: 'bg-orange-500' },
    { label: 'Mark Resolved', icon: '✓', color: 'bg-green-500' },
    { label: 'Close Ticket', icon: '●', color: 'bg-gray-500' },
  ];

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-white px-4 py-4 border-b border-gray-100`}>
        <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>Support Tickets</Text>
        
        <TextInput
          style={tw`bg-gray-100 rounded-xl px-4 py-3 text-gray-900 mb-3`}
          placeholder="Search tickets..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`-mx-4 px-4`}>
          <View style={tw`flex-row gap-2`}>
            {statusFilters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                onPress={() => setFilterStatus(filter.value as any)}
                style={tw`px-4 py-2 rounded-full ${filterStatus === filter.value ? 'bg-gray-900' : 'bg-gray-100'}`}
              >
                <Text style={tw`${filterStatus === filter.value ? 'text-white' : 'text-gray-700'} font-medium`}>
                  {filter.label} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-4 gap-3`}>
          {tickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              onPress={() => setSelectedTicket(ticket)}
              style={tw`bg-white rounded-2xl p-4`}
            >
              <View style={tw`flex-row items-start justify-between mb-3`}>
                <View style={tw`flex-1 mr-3`}>
                  <View style={tw`flex-row items-center gap-2 mb-1`}>
                    <Text style={tw`font-bold text-gray-900 text-sm`}>{ticket.id}</Text>
                    <View style={tw`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`} />
                  </View>
                  <Text style={tw`text-gray-900 font-medium text-base mb-1`} numberOfLines={1}>
                    {ticket.subject}
                  </Text>
                  <Text style={tw`text-gray-600 text-sm`}>{ticket.user}</Text>
                </View>
                <View style={tw`px-3 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                  <Text style={tw`text-xs font-semibold capitalize`}>{ticket.status.replace('_', ' ')}</Text>
                </View>
              </View>
              <View style={tw`flex-row items-center justify-between pt-3 border-t border-gray-100`}>
                <Text style={tw`text-gray-600 text-sm`}>
                  ◐ {ticket.messages} messages • {ticket.created}
                </Text>
                <Text style={tw`text-blue-600 font-semibold text-sm`}>View →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={selectedTicket !== null} animationType="slide" transparent>
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-t-3xl p-6 pb-10`}>
            <View style={tw`flex-row items-center justify-between mb-6`}>
              <Text style={tw`text-xl font-bold text-gray-900`}>Ticket {selectedTicket?.id}</Text>
              <TouchableOpacity onPress={() => setSelectedTicket(null)}>
                <Text style={tw`text-gray-600 text-2xl`}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={tw`max-h-96`}>
              <View style={tw`bg-gray-50 rounded-xl p-4 mb-4`}>
                <View style={tw`flex-row items-center justify-between mb-2`}>
                  <Text style={tw`text-gray-600`}>Customer</Text>
                  <Text style={tw`text-gray-900 font-semibold`}>{selectedTicket?.user}</Text>
                </View>
                <View style={tw`flex-row items-center justify-between mb-2`}>
                  <Text style={tw`text-gray-600`}>Subject</Text>
                  <Text style={tw`text-gray-900 font-semibold flex-1 text-right ml-2`} numberOfLines={1}>
                    {selectedTicket?.subject}
                  </Text>
                </View>
                <View style={tw`flex-row items-center justify-between mb-2`}>
                  <Text style={tw`text-gray-600`}>Priority</Text>
                  <View style={tw`flex-row items-center gap-2`}>
                    <View style={tw`w-2 h-2 rounded-full ${getPriorityColor(selectedTicket?.priority || 'medium')}`} />
                    <Text style={tw`text-gray-900 font-semibold capitalize`}>{selectedTicket?.priority}</Text>
                  </View>
                </View>
                <View style={tw`flex-row items-center justify-between`}>
                  <Text style={tw`text-gray-600`}>Created</Text>
                  <Text style={tw`text-gray-900 font-semibold`}>{selectedTicket?.created}</Text>
                </View>
              </View>

              <View style={tw`bg-blue-50 rounded-xl p-4 mb-4`}>
                <View style={tw`flex-row items-start gap-3`}>
                  <View style={tw`w-8 h-8 rounded-full bg-blue-500 items-center justify-center`}>
                    <Text style={tw`text-white font-bold text-sm`}>
                      {selectedTicket?.user?.charAt(0)}
                    </Text>
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-gray-900 font-semibold mb-1`}>{selectedTicket?.user}</Text>
                    <Text style={tw`text-gray-700`}>
                      Hello, I have an issue with my order. Can you please help me?
                    </Text>
                    <Text style={tw`text-gray-500 text-xs mt-2`}>{selectedTicket?.created}</Text>
                  </View>
                </View>
              </View>

              <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3`}>Quick Actions</Text>
              <View style={tw`gap-2 mb-4`}>
                {quickActions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={tw`${action.color} rounded-xl py-3 px-4 flex-row items-center`}
                  >
                    <Text style={tw`text-white text-xl mr-3`}>{action.icon}</Text>
                    <Text style={tw`text-white font-semibold flex-1`}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={tw`bg-white border border-gray-200 rounded-xl`}>
                <TextInput
                  style={tw`px-4 py-3 text-gray-900 min-h-24`}
                  placeholder="Type your reply..."
                  multiline
                  textAlignVertical="top"
                  placeholderTextColor="#9CA3AF"
                />
                <View style={tw`border-t border-gray-200 p-3`}>
                  <TouchableOpacity style={tw`bg-blue-500 rounded-full py-3`}>
                    <Text style={tw`text-white text-center font-semibold`}>Send Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
